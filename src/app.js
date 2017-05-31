import http from 'http'
import { env, mongo, port, ip } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import socket from './services/socket'
import io from 'socket.io'
import api from './api'

const app = express(api)
const server = http.createServer(app)

const socketio = io(server)
socket(socketio)

mongoose.connect(mongo.uri)

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

export default app
