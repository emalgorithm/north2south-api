import { Journey } from '.'
import { User } from '../user'

let user, journey

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  journey = await Journey.create({ user_id: user, journey_id: 'test', checkpoints: 'test', title: 'test', description: 'test', donate_url: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = journey.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(journey.id)
    expect(typeof view.user_id).toBe('object')
    expect(view.user_id.id).toBe(user.id)
    expect(view.journey_id).toBe(journey.journey_id)
    expect(view.checkpoints).toBe(journey.checkpoints)
    expect(view.title).toBe(journey.title)
    expect(view.description).toBe(journey.description)
    expect(view.donate_url).toBe(journey.donate_url)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = journey.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(journey.id)
    expect(typeof view.user_id).toBe('object')
    expect(view.user_id.id).toBe(user.id)
    expect(view.journey_id).toBe(journey.journey_id)
    expect(view.checkpoints).toBe(journey.checkpoints)
    expect(view.title).toBe(journey.title)
    expect(view.description).toBe(journey.description)
    expect(view.donate_url).toBe(journey.donate_url)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
