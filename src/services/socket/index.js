import checkpointSocket from '../../api/checkpoint/socket'

exports.setUpSocketServer = (socketio) => {
  console.log("Setting up Socket Server");
  checkpointSocket.setUpSocketRoom(socketio);

  // When the user connects.. perform this
  // socketio.on('connection', function (socket) {
  //   console.log("Someone connected to the socket!");
  //   checkpointSocket.register(socket)
  // })
};

