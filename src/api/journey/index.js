import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, feed, show, update, destroy } from './controller'
import { schema } from './model'
export Journey, { schema } from './model'

const router = new Router()
const { name, description, donateUrl, destination } = schema.tree

/**
 * @api {post} /journeys Create journey
 * @apiName CreateJourney
 * @apiGroup Journey
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Journey's name.
 * @apiParam description Journey's description.
 * @apiParam donateUrl Journey's donateUrl.
 * @apiSuccess {Object} journey Journey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Journey not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ name, description, donateUrl, destination }),
  create)

/**
 * @api {get} /journeys Retrieve journeys
 * @apiName RetrieveJourneys
 * @apiGroup Journey
 * @apiUse listParams
 * @apiSuccess {Object[]} journeys List of journeys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query({
    owner: {
      type: String,
      paths: ['owner']
    }
  }),
  index)


/**
 * @api {get} /journeys/feed Retrieve journeys (focused)
 * @apiName RetrieveJourneysFeed
 * @apiGroup Journey
 * @apiUse listParams
 * @apiSuccess {Object[]} journeys List of journeys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/feed',
  query({
    owner: {
      type: String,
      paths: ['owner']
    }
  }),
  feed)

/**
 * @api {get} /journeys/:id Retrieve journey
 * @apiName RetrieveJourney
 * @apiGroup Journey
 * @apiSuccess {Object} journey Journey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Journey not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /journeys/:id Update journey
 * @apiName UpdateJourney
 * @apiGroup Journey
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Journey's name.
 * @apiParam description Journey's description.
 * @apiParam donateUrl Journey's donateUrl.
 * @apiSuccess {Object} journey Journey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Journey not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, description, donateUrl }),
  update)

/**
 * @api {delete} /journeys/:id Delete journey
 * @apiName DeleteJourney
 * @apiGroup Journey
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Journey not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
