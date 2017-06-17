import mongoose, { Schema } from 'mongoose'

const statusUpdateSchema = new Schema({
  title: String,
  content: String,
  createdBy: { ref: 'User', type: Schema.Types.ObjectId, required: true},
  journey: { ref: 'Journey', type: Schema.Types.ObjectId, required: true}
}, {
  timestamps: true
})

statusUpdateSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      title: this.title,
      content: this.content,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('StatusUpdate', statusUpdateSchema)

export const schema = model.schema
export default model
