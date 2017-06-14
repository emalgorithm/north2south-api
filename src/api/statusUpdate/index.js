import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export StatusUpdate, { schema } from './model'

const router = new Router()
const { journey, title, content } = schema.tree

/**
 * @api {post} /statusUpdates Create status update
 * @apiName CreateStatusUpdate
 * @apiGroup StatusUpdate
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Status update's title.
 * @apiParam content Status update's content.
 * @apiSuccess {Object} statusUpdate Status update's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Status update not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ journey, title, content }),
  create)

/**
 * @api {get} /statusUpdates Retrieve status updates
 * @apiName RetrieveStatusUpdates
 * @apiGroup StatusUpdate
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} statusUpdates List of status updates.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /statusUpdates/:id Retrieve status update
 * @apiName RetrieveStatusUpdate
 * @apiGroup StatusUpdate
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} statusUpdate Status update's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Status update not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /statusUpdates/:id Update status update
 * @apiName UpdateStatusUpdate
 * @apiGroup StatusUpdate
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Status update's title.
 * @apiParam content Status update's content.
 * @apiSuccess {Object} statusUpdate Status update's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Status update not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, content }),
  update)

/**
 * @api {delete} /statusUpdates/:id Delete status update
 * @apiName DeleteStatusUpdate
 * @apiGroup StatusUpdate
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Status update not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
