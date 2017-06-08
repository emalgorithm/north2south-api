import mongoose, { Schema } from 'mongoose'

const journeySchema = new Schema({
  userId: {
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
  title: {
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
