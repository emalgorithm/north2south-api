var socketRoom = null

exports.setUpSocketRoom = (io) => {
  socketRoom = io
}

exports.onSave = (checkpoint) => {
  console.log("Broadcasting checkpoint update")
  socketRoom.emit('checkpoint:save', checkpoint)
}
