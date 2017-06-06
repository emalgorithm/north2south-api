import mongoose, { Schema } from 'mongoose'
import { onSave } from './socket'

const checkpointSchema = new Schema({
  heartRate: Number,
  calories: Number,
  distance: Number,
  longitude: Number,
  latitude: Number,
  createdAt: Date
})

checkpointSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      heartRate: this.heartRate,
      calories: this.calories,
      distance: this.distance,
      longitude: this.longitude,
      latitude: this.latitude,
      createdAt: this.createdAt,
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

checkpointSchema.post('save', function (doc) {
  onSave(doc);
});

const model = mongoose.model('Checkpoint', checkpointSchema)

export const schema = model.schema
export default model
