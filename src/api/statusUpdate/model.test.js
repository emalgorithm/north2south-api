import { StatusUpdate } from '.'
import { Journey } from '../journey'
import { User } from '../user'

let statusUpdate

beforeEach(async () => {
  const owner = await User.create({ name: 'user', email: 'h@h.com', password: '123456'})
  const journey = await Journey.create({ name: 'Test Journey', description: 'Test description', owner: owner })
  statusUpdate = await StatusUpdate.create({ journey: journey, title: 'test', content: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = statusUpdate.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(statusUpdate.id)
    expect(view.title).toBe(statusUpdate.title)
    expect(view.content).toBe(statusUpdate.content)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = statusUpdate.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(statusUpdate.id)
    expect(view.title).toBe(statusUpdate.title)
    expect(view.content).toBe(statusUpdate.content)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
