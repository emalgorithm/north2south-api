import mongoose, { Schema } from 'mongoose'
import { onSave } from './socket'
import { Journey } from '../journey'

const checkpointSchema = new Schema({
  journey: { ref: 'Journey', type: Schema.Types.ObjectId, required: true},
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
  },

  addToJourney (journeyId) {
    const self = this
    return Journey.findByIdAndUpdate(
      journeyId,{ $push: {checkpoints: self.id } })
      .then((journey) => journey ? self : null)
  }
}

checkpointSchema.pre('save', function(next) { this.wasNew = this.isNew; next() })
checkpointSchema.post('save', function(c) { if (c.wasNew) onSave(c) })

const model = mongoose.model('Checkpoint', checkpointSchema)

export const schema = model.schema
export default model
