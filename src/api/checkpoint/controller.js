import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Checkpoint } from '.'
import { Journey } from '../journey'

export const create = ({ bodymen: { body } }, res, next) =>
  Journey.findById(body.journeyId).exec()
    .then(notFound(res))
    .then((journey) => journey.addCheckpoint(body))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Checkpoint.find(query, select, cursor)
    .then((checkpoints) => checkpoints.map((checkpoint) => checkpoint.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Checkpoint.findById(params.id)
    .then(notFound(res))
    .then((checkpoint) => checkpoint ? checkpoint.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Checkpoint.findById(params.id)
    .then(notFound(res))
    .then((checkpoint) => checkpoint ? _.merge(checkpoint, body).save() : null)
    .then((checkpoint) => checkpoint ? checkpoint.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Checkpoint.findById(params.id)
    .then(notFound(res))
    .then((checkpoint) => checkpoint ? checkpoint.remove() : null)
    .then(success(res, 204))
    .catch(next)
