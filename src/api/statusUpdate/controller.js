import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { StatusUpdate } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  StatusUpdate.create({ ...body, createdBy: user })
    .then((statusUpdate) => statusUpdate.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  StatusUpdate.find(query, select, cursor)
    .then((statusUpdates) => statusUpdates.map((statusUpdate) => statusUpdate.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  StatusUpdate.findById(params.id)
    .then(notFound(res))
    .then((statusUpdate) => statusUpdate ? statusUpdate.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  StatusUpdate.findById(params.id)
    .then(notFound(res))
    .then((statusUpdate) => statusUpdate ? _.merge(statusUpdate, body).save() : null)
    .then((statusUpdate) => statusUpdate ? statusUpdate.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  StatusUpdate.findById(params.id)
    .then(notFound(res))
    .then((statusUpdate) => statusUpdate ? statusUpdate.remove() : null)
    .then(success(res, 204))
    .catch(next)
