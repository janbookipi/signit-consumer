const spawn = require('child_process').spawn

/**
 * Executes a command
 *
 * @param {number} index - The index of the command executed
 * @param {string} command - The command to execute
 * @param {string[]} args - The args to pass to the command
 * @param {object} options - The options to pass to the command
 */
async function execute(index, command, args, options) {
  const exec = spawn(command, args, options)
  exec.stdout.on('data', function (data) {
    console.log(`stdout [${index}]:`, data.toString())
  })
  exec.stderr.on('data', function (data) {
    console.log(`stderr [${index}]:`, data.toString())
  })
  exec.on('error', function (err) {
    console.error(`error [${index}]:`, err)
  })
  return new Promise((resolve) => {
    exec.on('close', resolve)
  })
}

/**
 * Runs the Cypress tests in parallel
 */
async function runCypressTests() {
  const threads = parseInt(process.env.TEST_THREADS || '4')
  const codeArr = []

  for (let i = 0; i < threads; ++i) {
    codeArr.push(
      execute(i, 'docker', [
        'compose',
        'run',
        '--rm', // This option tells Docker to automatically remove the container when it exits.
        '-e',
        `SPLIT=${threads}`,
        '-e',
        `SPLIT_INDEX=${i}`,
        'test',
      ])
    )
  }

  process.exit((await Promise.all(codeArr)).reduce((a, b) => a || b, 0))
}

runCypressTests()
