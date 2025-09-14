const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')
require('dotenv').config()

const supportedLanguages = ['es', 'fr', 'pt', 'zh-Hant']
const sourceLang = 'en'
const basePath = './public/translations'
const apiKey = process.env.OPENAI_API_KEY
const organization = process.env.OPENAI_ORG

if (!apiKey || !organization) {
  console.error(
    'Please set OPENAI_API_KEY and OPENAI_ORG environment variables'
  )
  process.exit(1)
}

function sortObjectByKeys(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {})
}

const openai = new OpenAI({
  apiKey,
  organization,
})

// Define the expected JSON schema for translations
const translationSchema = {
  name: 'translation_response',
  schema: {
    additionalProperties: false,
    properties: {
      forTranslation: {
        items: {
          additionalProperties: false,
          properties: {
            language: { type: 'string' },
            text: { type: 'string' },
            translation: { type: 'string' },
          },
          required: ['language', 'text', 'translation'],
          type: 'object',
        },
        type: 'array',
      },
    },
    required: ['forTranslation'],
    type: 'object',
  },
  strict: true, // Enforce strict output validation
}

async function processTranslations() {
  console.log('start translation')
  const namespaces = getNamespaces()
  for (const namespace of namespaces) {
    let textsToTranslate = []
    let sourceTranslations = readJsonFile(sourceLang, namespace)

    // Sort source language translations before processing
    sourceTranslations = sortObjectByKeys(sourceTranslations)

    for (const [key, text] of Object.entries(sourceTranslations)) {
      if (key && text) {
        textsToTranslate = textsToTranslate.concat(
          checkTranslations(key, text, namespace)
        )
      }
    }

    removeUnusedKeys(namespace, sourceTranslations)

    if (textsToTranslate.length > 0) {
      console.log('translating,', textsToTranslate)
      await translate(textsToTranslate, namespace)
    } else {
      console.log(namespace, 'no translations needed')
    }

    // Save sorted source language file
    fs.writeFileSync(
      path.join(basePath, sourceLang, `${namespace}`),
      JSON.stringify(sourceTranslations, null, 2)
    )
  }
  console.log('end translation')
}

function getNamespaces() {
  return fs.readdirSync(path.join(basePath, sourceLang))
}

function readJsonFile(lang, namespace) {
  const filePath = path.join(basePath, lang, `${namespace}`)
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }
  return {}
}

function checkTranslations(key, text, namespace) {
  const textsToTranslate = []

  for (const lang of supportedLanguages) {
    const translations = readJsonFile(lang, namespace)
    if (!translations[key] && text) {
      textsToTranslate.push({ language: lang, text })
    }
  }

  return textsToTranslate
}

function removeUnusedKeys(namespace, sourceTranslations) {
  supportedLanguages.forEach((lang) => {
    if (lang === sourceLang) return

    const translations = readJsonFile(lang, namespace)
    let isChanged = false

    Object.keys(translations).forEach((key) => {
      if (!sourceTranslations[key]) {
        console.log(`removing "${key}" from ${lang} ${namespace}`)
        delete translations[key]
        isChanged = true
      }
    })

    if (isChanged) {
      const sortedTranslations = sortObjectByKeys(translations)
      fs.writeFileSync(
        path.join(basePath, lang, `${namespace}`),
        JSON.stringify(sortedTranslations, null, 2)
      )
    }
  })
}

async function updateTranslationFiles(translatedTexts, namespace) {
  console.log(namespace, 'updating translation files...')

  for (const { language, text, translation } of translatedTexts) {
    const translations = readJsonFile(language, namespace)
    const key = getKey(text, namespace)
    // Only add the translation if the key is found
    if (key) {
      translations[key] = translation
    }

    // Sort the translations
    const sortedTranslations = sortObjectByKeys(translations)

    // Write the sorted translations back to the file
    fs.writeFileSync(
      path.join(basePath, language, `${namespace}`),
      JSON.stringify(sortedTranslations, null, 2)
    )
  }
}

function getKey(text, namespace) {
  const original = readJsonFile('en', namespace)
  let key = null
  for (let k in original) {
    if (original[k] === text) key = k
  }
  return key
}

async function executeInChatGPT(toBeTranslated) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        content:
          'You are a helpful assistant for translation in an invoicing and proposal software. Translate the provided phrases from English into Spanish (es), French (fr), Portuguese (pt), and Traditional Chinese (zh-Hant). If a word is enclosed in double curly braces {{like this}}, it should remain untranslated.',
        role: 'system',
      },
      {
        content: `Translate the following: ${JSON.stringify(toBeTranslated)}`,
        role: 'user',
      },
    ],
    model: 'gpt-4o-2024-08-06',
    response_format: {
      json_schema: translationSchema,
      type: 'json_schema',
    },
    temperature: 0.1,
  })

  // The response will be strictly validated by the schema.
  const parsedResponse = completion.choices[0].message.content
  return JSON.parse(parsedResponse)
}

async function translate(items, namespace) {
  try {
    const translations = await executeInChatGPT(items)
    if (!translations) throw new Error('No translations returned from API.')

    // Update translation files with structured output
    updateTranslationFiles(translations.forTranslation, namespace)
  } catch (error) {
    console.error(`Error translating ${namespace}:`, error.message)
  }
}

processTranslations().catch(console.error)
