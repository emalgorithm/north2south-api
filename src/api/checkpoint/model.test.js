import { Checkpoint } from '.'
import { User } from '../user'

let user, checkpoint

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  checkpoint = await Checkpoint.create({ user, heartbeats: 'test', calories: 'test', GPSPositions: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = checkpoint.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.heartbeats).toBe(checkpoint.heartbeats)
    expect(view.calories).toBe(checkpoint.calories)
    expect(view.GPSPositions).toBe(checkpoint.GPSPositions)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = checkpoint.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.heartbeats).toBe(checkpoint.heartbeats)
    expect(view.calories).toBe(checkpoint.calories)
    expect(view.GPSPositions).toBe(checkpoint.GPSPositions)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
