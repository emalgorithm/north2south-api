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
  title: {
    type: String
  },
  img: {
    type: String
  },
  description: {
    type: String
  },
  explorer_info: {
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
      title: this.title,
      img: this.img,
      description: this.description,
      explorer_info: this.explorer_info,
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
