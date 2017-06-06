import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Journey } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Journey.create({ ...body, user_id: user })
    .then((journey) => journey.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Journey.find(query, select, cursor)
    .populate('user_id')
    .then((journeys) => journeys.map((journey) => journey.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Journey.findById(params.id)
    .populate('user_id')
    .then(notFound(res))
    .then((journey) => journey ? journey.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Journey.findById(params.id)
    .populate('user_id')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user_id'))
    .then((journey) => journey ? _.merge(journey, body).save() : null)
    .then((journey) => journey ? journey.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Journey.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user_id'))
    .then((journey) => journey ? journey.remove() : null)
    .then(success(res, 204))
    .catch(next)
