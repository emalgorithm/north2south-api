import checkpointSocket from '../../api/checkpoint/socket'

exports.setUpSocketServer = (socketio) => {
  console.log("Setting up Socket Server");
  checkpointSocket.register(socketio);

  socketio.on('connection', socket => {
    socket.on('notify-me', (following, cb) => {
      for (let f of following) {
        socket.join(f)
      }
      let notifications = []
      cb(notifications)
    })

    socket.on('join:journey', (id) => {
        socket.join(id)
    })
  })
};
