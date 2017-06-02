var sockets = []

exports.register = (socket) => {
  console.log('registered socket ' + socket.id)
  sockets.push(socket)
}

exports.onSave = (checkpoint) => {
  console.log('save hook for ' + checkpoint.id)
  sockets.forEach((s) => s.emit('checkpoint:save', checkpoint))
}
