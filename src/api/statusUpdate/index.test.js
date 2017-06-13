import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { StatusUpdate } from '.'
import { Journey } from '../journey'

const app = () => express(routes)

let userSession, statusUpdate, journey

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user.id)
  journey = await Journey.create({ name: 'Test Journey', description: 'Test description', owner: user })
  
  statusUpdate = await StatusUpdate.create({journey: journey})
})

test('POST /statusUpdates 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, journey: journey.id, title: 'test', content: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.content).toEqual('test')
})

test('POST /statusUpdates 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /statusUpdates 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /statusUpdates 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /statusUpdates/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${statusUpdate.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(statusUpdate.id)
})

test('GET /statusUpdates/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${statusUpdate.id}`)
  expect(status).toBe(401)
})

test('GET /statusUpdates/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /statusUpdates/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${statusUpdate.id}`)
    .send({ access_token: userSession, title: 'test', content: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(statusUpdate.id)
  expect(body.title).toEqual('test')
  expect(body.content).toEqual('test')
})

test('PUT /statusUpdates/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${statusUpdate.id}`)
  expect(status).toBe(401)
})

test('PUT /statusUpdates/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: userSession, title: 'test', content: 'test' })
  expect(status).toBe(404)
})

test('DELETE /statusUpdates/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${statusUpdate.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /statusUpdates/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${statusUpdate.id}`)
  expect(status).toBe(401)
})

test('DELETE /statusUpdates/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
