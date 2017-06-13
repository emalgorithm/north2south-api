import mongoose, { Schema } from 'mongoose'

const journeySchema = new Schema({
  name: { type: String, required: true},
  description: { type: String, required: true},

  owner: { type: Schema.ObjectId, ref: 'User', required: true },

  statusUpdates: [{
    title: String,
    content: String
  }],

  charities: [String],
  donateUrl: String,

  destination: {
    longitude: Number,
    latitude: Number
  }
}, {
  timestamps: true
})

journeySchema.virtual('checkpoints', {
  ref: 'Checkpoint',
  localField: '_id',
  foreignField: 'journey'
})

journeySchema.virtual('latestCheckpoint')
  .get(function() {
    console.log(this.checkpoints)
    return this.checkpoints.length > 0
      ? this.checkpoints[this.checkpoints.length - 1]
      : undefined
  })

journeySchema.virtual('latestStatusUpdate')
  .get(function () {
    return this.statusUpdates.length > 0
      ? this.statusUpdates[this.statusUpdates.length - 1]
      : undefined
  })

journeySchema.methods = {
  focused () {
    var focusedJourney = {
      id: this.id,
      name: this.name,
      owner: this.owner.view(),
      checkpoint: this.latestCheckpoint,
      status: this.latestStatusUpdate
    }

    return focusedJourney
  },

  view (full) {
    const view = {
      // simple view
      id: this.id,
      owner: this.owner.view(full),
      checkpoints: this.checkpoints,
      latestCheckpoint: this.latestCheckpoint,
      name: this.name,
      charities: this.charities,
      description: this.description,
      donateUrl: this.donateUrl,
      destination: this.destination,
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
