import { Checkpoint } from '.'

let checkpoint

beforeEach(async () => {
  checkpoint = await Checkpoint.create({ heartRate: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = checkpoint.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(view.heartRate).toBe(checkpoint.heartRate)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = checkpoint.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(view.heartRate).toBe(checkpoint.heartRate)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
