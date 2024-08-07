const SmeeClient = require('smee-client')

const smee = new SmeeClient({
  source: 'https://smee.io/your_unique_channel',
  target: 'http://localhost:3000/webhook',
  logger: console
})

const events = smee.start()