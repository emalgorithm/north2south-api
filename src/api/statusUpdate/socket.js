var io = null

exports.register = (_io) => io = _io

exports.onSave = (status) => {
  io.to(status.createdBy._id)
    .to(status.journey.toString())
    .emit('statusUpdate:save', {
        statusUpdate: status
      })
}
