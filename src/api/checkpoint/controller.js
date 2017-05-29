import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Checkpoint } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Checkpoint.create({ ...body, user })
    .then((checkpoint) => checkpoint.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Checkpoint.find(query, select, cursor)
    .populate('user')
    .then((checkpoints) => checkpoints.map((checkpoint) => checkpoint.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Checkpoint.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((checkpoint) => checkpoint ? checkpoint.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Checkpoint.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((checkpoint) => checkpoint ? _.merge(checkpoint, body).save() : null)
    .then((checkpoint) => checkpoint ? checkpoint.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Checkpoint.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((checkpoint) => checkpoint ? checkpoint.remove() : null)
    .then(success(res, 204))
    .catch(next)
