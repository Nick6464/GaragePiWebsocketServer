const dotenv = require('dotenv')
const express = require('express')
const jwtMiddleware = require('./jwtMiddleware')
const WebSocket = require('ws')
require('dotenv').config()

const connections = new Map()

const { hostname, port } = process.env

const app = express()
const wss = new WebSocket.Server({ noServer: true })

app.use(express.json())

app.post('/press', jwtMiddleware, (req, res) => {
  const { raspberryPiId } = req.body

  const ws = connections.get(raspberryPiId)
  if (!ws) {
    return res.status(404).json({ error: 'Raspberry Pi not found' })
  }

  const token = req.headers['authorization']
  ws.send(JSON.stringify({ command: 'press', token }))

  res.json({ message: 'Request sent to Raspberry Pi' })
})

app.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`)
})

wss.on('connection', (ws, req) => {
  const raspberryPiId = req.headers['raspberry-pi-id']
  connections.set(raspberryPiId, ws)

  console.log('New WebSocket connection')

  ws.on('message', (message) => {
    console.log('Received: %s', message)
  })

  ws.on('close', () => {
    console.log('WebSocket connection closed')
    connections.delete(raspberryPiId)
  })
})
