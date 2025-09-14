const { defineConfig } = require('cypress')

const plugins = require('./cypress/plugins')
const cypressSplit = require('cypress-split')

module.exports = defineConfig({
  browser: {
    // Disable GPU to prevent Chrome from crashing
    chromeFlags: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-software-rasterizer',
    ],
    chromeWebSecurity: false,
    name: 'chrome',
  },
  chromeWebSecurity: false,

  component: {
    devServer: {
      bundler: 'webpack',
      framework: 'create-react-app',
    },
  },

  defaultCommandTimeout: 20000,
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    experimentalMemoryManagement: true,
    setupNodeEvents(on, config) {
      config = plugins(on, config)
      cypressSplit(on, config)
      require('cypress-mochawesome-reporter/plugin')(on)

      return config
    },
    specPattern: 'cypress/tests/**/*.*.js',
    supportFile: 'cypress/support/index.js',
  },

  env: {
    API_AUTHORIZATION_HEADER:
      'Basic NWY2YmY1ZjNhYTMxZDRjMzA5NjM0MjAyOmFwcFNlY3JldDE=',
    API_URL: 'http://localhost:8082',
    BOOKIPAY_API_URL: 'https://bpay-dev.bkpi.co',
    BOOKIPAY_AUTHORIZATION_HEADER:
      'Bearer t3g6ZThteJmcw9gKwWSM7kKbMZVpekgjvKpRyr5wMU2X3bKpgrnayg2EhrnJP51NAdL3kiyVrnHPQKCrj6BY97pnD47VvXL5xeqARad2atWrKxZ7JC0wVCVNmQUNEEupGmcmamqZTz34c5kiBXB5Wv3wYLJTSmRwVSjHYRHfVYVL9eFBSyUmWgA7ctryDJHWadvJGi4hgdcBKxii53Jaz6WZVDqbqzxxLrY8kgC7SzUfrWwzq37duMxhDErJE1La',
    CI: true,
    DEFAULT_ACCOUNT_EMAIL: 'wrtdw.v2.bkpi-web-auto@inbox.testmail.app',
    DEFAULT_ACCOUNT_PASSWORD: 'abcd1234#',
    DEFAULT_COMPANY_ID: '65f7d10f8d6f55308d27f355',
    DISABLED_ACCOUNT_EMAIL: 'disabled@disabled.com',
    DISABLED_ACCOUNT_PASSWORD: 'abcd1234#',
    MONGO_DB_NAME: 'invoicebee',
    MONGO_DB_V2_NAME: 'v2',
    MONGO_URL:
      'mongodb+srv://bkdev-bookipi:i%26m0n4ro1lag%26y@skunk3.arbqp.mongodb.net',

    TEST_MAIL_API_KEY: 'edf3c8e5-c301-4be6-b838-8afd59cc00bc',
    TEST_MAIL_URL: 'https://api.testmail.app/api/graphql',
  },
  numTestsKeptInMemory: 0,

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
      reportPageTitle: 'custom-title',
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/reports/junit/results-[hash].xml',
    },
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
  },
  retries: {
    openMode: 0,
    runMode: 1,
  },

  screenshotOnRunFailure: false,
  video: false,
  viewportHeight: 1500,

  viewportWidth: 1280,
})
