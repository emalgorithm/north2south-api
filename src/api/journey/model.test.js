import { Journey } from '.'
import { User } from '../user'
import * as socket from '../checkpoint/socket'
import { Checkpoint } from '../checkpoint'
import { StatusUpdate } from '../statusUpdate'

const ioMock = {
  emit: jest.fn()
}

socket.register(ioMock)

let user, journey, checkpoint1, checkpoint2

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  journey = await Journey.create({ owner: user, name: 'test', description: 'test', donateUrl: 'test' ,
    destination: {
      latitude: 25.5,
      longitude: 43.3
    }});

  checkpoint1 = await Checkpoint.create({ journey: journey._id, distance: 1, longitude: 3, latitude: 3 })
  checkpoint2 = await Checkpoint.create({ journey: journey._id, distance: 2, longitude: 2, latitude: 3 })
})

describe('view', () => {
  it('returns simple view', (done) => {
    Journey.findOne().populate('checkpoints').exec(function(err, journey) {
      console.error(err)
      const view = journey.view()
      expect(typeof view).toBe('object')
      expect(view.id).toBe(journey.id)
      expect(typeof view.owner).toBe('object')
      expect(view.owner.id).toBe(user.id)
      expect(view.name).toBe(journey.name)
      expect(view.description).toBe(journey.description)
      expect(view.donateUrl).toBe(journey.donateUrl)
      expect(view.destination).toBe(journey.destination)
      expect(view.createdAt).toBeTruthy()
      expect(view.updatedAt).toBeTruthy()
      expect(view.distanceTotal).toBeGreaterThan(0);
      done()
    })
  })

  it('returns full view', (done) => {
    Journey.findOne().populate('checkpoints').exec(function(err, journey) {

      const view = journey.populate('checkpoints').view(true)
      expect(typeof view).toBe('object')
      expect(view.id).toBe(journey.id)
      expect(typeof view.owner).toBe('object')
      expect(view.owner.id).toBe(user.id)
      expect(view.name).toBe(journey.name)
      expect(view.description).toBe(journey.description)
      expect(view.donateUrl).toBe(journey.donateUrl)
      expect(view.destination).toBe(journey.destination)
      expect(view.createdAt).toBeTruthy()
      expect(view.updatedAt).toBeTruthy()
      expect(view.distanceTotal).toBeGreaterThan(0);
      done()
    })
  })

  it('populates checkpoints', (done) => {
    Journey.findOne().populate('checkpoints').exec(function(error, journey) {
      let checkpoints = journey.view(true).checkpoints
      expect(checkpoints.map(c => c.toObject())).toEqual([checkpoint1.toObject(), checkpoint2.toObject()])
      done()
    })
  })
})
