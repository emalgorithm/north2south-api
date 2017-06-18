import mongoose, { Schema } from 'mongoose'
import { onSave } from './socket'

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
      createdBy: this.createdBy.view(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

statusUpdateSchema.pre('save', function(next) { this.wasNew = this.isNew; next() })
statusUpdateSchema.post('save', function(s) { if (s.wasNew) onSave(s) })

const model = mongoose.model('StatusUpdate', statusUpdateSchema)

export const schema = model.schema
export default model
