import { Checkpoint } from '.'
import * as socket from './socket'
import { Journey } from '../journey'
import { User } from '../user'

const ioMock = {
  emit: jest.fn()
}

socket.register(ioMock)

let checkpoint

beforeEach(async () => {
  const owner = await User.create({ name: 'user', email: 'g@g.com', password: '123456'})
  const journey = await Journey.create({ name: 'Test Journey', description: 'Test description', owner: owner })
  checkpoint = await Checkpoint.create({ journey: journey, heartRate: 67 })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = checkpoint.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(view.heartRate).toBe(checkpoint.heartRate)
  })

  it('returns full view', () => {
    const view = checkpoint.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(view.heartRate).toBe(checkpoint.heartRate)
  })
})
