import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Journey } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Journey.create({ ...body, userId: user })
    .then((journey) => journey.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Journey.find(query, select, cursor)
    .populate('userId')
    .then((journeys) => journeys.map((journey) => journey.view(true)))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Journey.findById(params.id)
    .populate('userId')
    .then(notFound(res))
    .then((journey) => journey ? journey.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Journey.findById(params.id)
    .populate('userId')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'userId'))
    .then((journey) => journey ? _.merge(journey, body).save() : null)
    .then((journey) => journey ? journey.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Journey.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'userId'))
    .then((journey) => journey ? journey.remove() : null)
    .then(success(res, 204))
    .catch(next)
