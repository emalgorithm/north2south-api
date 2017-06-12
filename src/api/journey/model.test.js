import { Journey } from '.'
import { User } from '../user'

let user, journey

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  journey = await Journey.create({ owner: user, checkpoints: [], name: 'test', description: 'test', donateUrl: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = journey.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(journey.id)
    expect(typeof view.owner).toBe('object')
    expect(view.owner.id).toBe(user.id)
    expect(view.checkpoints).toBe(journey.checkpoints)
    expect(view.name).toBe(journey.name)
    expect(view.description).toBe(journey.description)
    expect(view.donateUrl).toBe(journey.donateUrl)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = journey.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(journey.id)
    expect(typeof view.owner).toBe('object')
    expect(view.owner.id).toBe(user.id)
    expect(view.checkpoints).toBe(journey.checkpoints)
    expect(view.name).toBe(journey.name)
    expect(view.description).toBe(journey.description)
    expect(view.donateUrl).toBe(journey.donateUrl)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
