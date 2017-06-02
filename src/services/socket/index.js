import checkpointSocket from '../../api/checkpoint/socket'

exports.setUpSocket = (socketio) => {
  // When the user connects.. perform this
  socketio.on('connection', function (socket) {
    console.log("Someone connected to the socket!")
    checkpointSocket.register(socket)
  })
}
