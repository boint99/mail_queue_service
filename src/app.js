const STARTSERVER = require('./server')
const STARTWORKER = require('./worker')

const app = async () => {
  STARTWORKER()
  console.log('\nWorker is running ...\n')

  STARTSERVER()
  console.log('\nAPI is running ...\n')
}

app()
