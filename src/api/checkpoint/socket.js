import { Journey } from '../journey'

var io = null

exports.register = (_io) => io = _io

exports.onSave = (checkpoint, ownerId) => {
  Journey.findById(checkpoint.journey)
    .then(journey => io.to(journey.owner)
      .to(checkpoint.journey.toString())
      .emit('checkpoint:save', {
        checkpoint: checkpoint,
        owner: journey.owner
      }))
}
