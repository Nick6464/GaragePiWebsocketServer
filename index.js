const dotenv = require('dotenv')
const express = require('express')
const jwtMiddleware = require('./jwtMiddleware')
require('dotenv').config()

const { hostname, port } = process.env

const app = express()

app.use(express.json())

// Button Press for 0.2 seconds
app.get('/press', jwtMiddleware.jwtVerificationMiddleware, (req, res) => {
  relay.writeSync(1)
  setTimeout(() => {
    relay.writeSync(0)
  }, 250)
  res.send('Relay is ON')
})

app.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`)
})

// Cleanup and unexport the relay GPIO pin on program exit
process.on('SIGINT', () => {
  relay.unexport()
  process.exit()
})
