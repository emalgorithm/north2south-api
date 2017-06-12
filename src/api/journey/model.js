import mongoose, { Schema } from 'mongoose'

const journeySchema = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  checkpoints: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Checkpoint'
    }]
  },
  name: {
    type: String
  },
  charities: {
    type: [String]
  },
  description: {
    type: String
  },
  donateUrl: {
    type: String
  },
  focusedMessage: { type: String },
  focusedCheckpoint: { type: Schema.ObjectId, ref: 'Checkpoint'}
}, {
  timestamps: true
})

journeySchema.methods = {
  focused () {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner.view(),
      message: this.focusedMessage,
      checkpoint: this.checkpoints.last().view(true)
    }
  },

  view (full) {
    const view = {
      // simple view
      id: this.id,
      owner: this.owner.view(full),
      checkpoints: this.checkpoints,
      name: this.name,
      charities: this.charities,
      description: this.description,
      donateUrl: this.donateUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Journey', journeySchema)

export const schema = model.schema
export default model
