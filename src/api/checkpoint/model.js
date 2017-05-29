import mongoose, { Schema } from 'mongoose'

const checkpointSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  heartbeats: {
    type: String
  },
  calories: {
    type: String
  },
  GPSPositions: {
    type: String
  }
}, {
  timestamps: true
})

checkpointSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      heartbeats: this.heartbeats,
      calories: this.calories,
      GPSPositions: this.GPSPositions,
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
