import request from 'supertest-as-promised'
import express from '../../services/express'
import routes, { Checkpoint } from '.'
import * as socket from './socket'

const ioMock = {
  emit: jest.fn()
}

socket.setUpSocketRoom(ioMock)

const app = () => express(routes)

let checkpoint

beforeEach(async () => {
  checkpoint = await Checkpoint.create({})
})

test('POST /checkpoints 201', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ heartRate: 67 })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.heartRate).toEqual(67)
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

test('PUT /checkpoints/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`/${checkpoint.id}`)
    .send({ heartRate: 67 })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(checkpoint.id)
  expect(body.heartRate).toEqual(67)
})

test('PUT /checkpoints/:id 404', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ heartRate: 'test' })
  expect(status).toBe(404)
})

test('DELETE /checkpoints/:id 204', async () => {
  const { status } = await request(app())
    .delete(`/${checkpoint.id}`)
  expect(status).toBe(204)
})

test('DELETE /checkpoints/:id 404', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
  expect(status).toBe(404)
})
