// When the user connects.. perform this
function onConnect(socket) {
  require('../../api/checkpoint/socket').register(socket)
}

export default (socketio) => {
  socketio.on('connection', function (socket) {
    console.log("Someone connected to the socket!")
    // Call onConnect
    onConnect(socket)
  })
}
