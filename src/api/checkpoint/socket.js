var sockets = []

export const register = (socket) => {
  console.log('registered socket ' + socket.id)
  sockets.push(socket)
}

export const onSave = (checkpoint) => {
  console.log('save hook for ' + checkpoint.id)
  sockets.forEach((s) => s.emit('checkpoint:save', checkpoint))
}
