import mongoose, { Schema } from 'mongoose'

const checkpointSchema = new Schema({
  heartRate: Number,
  calories: Number,
  distance: Number
}, {
  timestamps: true
})

checkpointSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      heartRate: this.heartRate,
      calories: this.calories,
      distance: this.distance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Checkpoint', checkpointSchema)

export const schema = model.schema
export default model
