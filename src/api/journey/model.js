import mongoose, { Schema } from 'mongoose'
import { schema as CheckpointSchema } from '../checkpoint/model'

const journeySchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  checkpoints: {
    type: [CheckpointSchema]
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  donateUrl: {
    type: String
  }
}, {
  timestamps: true
})

journeySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      userId: this.userId.view(full),
      checkpoints: this.checkpoints,
      title: this.title,
      description: this.description,
      donateUrl: this.donateUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  },

  addCheckpoint (checkpoint) {
    console.log('adding checkpoint to journey ' + checkpoint)

    // Add checkpoint and store its index
    var index = this.checkpoints.push(checkpoint) - 1

    return this.save().then((journey) =>
      journey ? journey.checkpoints[index].view(true) : null)
  },
}

const model = mongoose.model('Journey', journeySchema)

export const schema = model.schema
export default model
