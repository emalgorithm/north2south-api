import mongoose, { Schema } from 'mongoose'

const journeySchema = new Schema({
  user_id: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  journey_id: {
    type: String
  },
  checkpoints: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  donate_url: {
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
      user_id: this.user_id.view(full),
      journey_id: this.journey_id,
      checkpoints: this.checkpoints,
      title: this.title,
      description: this.description,
      donate_url: this.donate_url,
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
