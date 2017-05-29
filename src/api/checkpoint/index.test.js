import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Checkpoint } from '.'

const app = () => express(routes)

let userSession, anotherSession, checkpoint

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  checkpoint = await Checkpoint.create({ user })
})

test('POST /checkpoints 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, heartbeats: 'test', calories: 'test', GPSPositions: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.heartbeats).toEqual('test')
  expect(body.calories).toEqual('test')
  expect(body.GPSPositions).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /checkpoints 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /checkpoints 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /checkpoints/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${checkpoint.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(checkpoint.id)
})

test('GET /checkpoints/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /checkpoints/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${checkpoint.id}`)
    .send({ access_token: userSession, heartbeats: 'test', calories: 'test', GPSPositions: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(checkpoint.id)
  expect(body.heartbeats).toEqual('test')
  expect(body.calories).toEqual('test')
  expect(body.GPSPositions).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /checkpoints/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${checkpoint.id}`)
    .send({ access_token: anotherSession, heartbeats: 'test', calories: 'test', GPSPositions: 'test' })
  expect(status).toBe(401)
})

test('PUT /checkpoints/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${checkpoint.id}`)
  expect(status).toBe(401)
})

test('PUT /checkpoints/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, heartbeats: 'test', calories: 'test', GPSPositions: 'test' })
  expect(status).toBe(404)
})

test('DELETE /checkpoints/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${checkpoint.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /checkpoints/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${checkpoint.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /checkpoints/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${checkpoint.id}`)
  expect(status).toBe(401)
})

test('DELETE /checkpoints/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
