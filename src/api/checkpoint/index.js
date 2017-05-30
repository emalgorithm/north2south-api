import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Checkpoint, { schema } from './model'

const router = new Router()
const { heartbeats, calories, GPSPositions } = schema.tree

/**
 * @api {post} /checkpoints Create checkpoint
 * @apiName CreateCheckpoint
 * @apiGroup Checkpoint
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam heartbeats Checkpoint's heartbeats.
 * @apiParam calories Checkpoint's calories.
 * @apiParam GPSPositions Checkpoint's GPSPositions.
 * @apiSuccess {Object} checkpoint Checkpoint's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Checkpoint not found.
 * @apiError 401 user access only.
 */
router.post('/',
  // token({ required: true }), disabled for testing purposes
  body({ heartbeats, calories, GPSPositions }),
  create)

/**
 * @api {get} /checkpoints Retrieve checkpoints
 * @apiName RetrieveCheckpoints
 * @apiGroup Checkpoint
 * @apiUse listParams
 * @apiSuccess {Object[]} checkpoints List of checkpoints.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /checkpoints/:id Retrieve checkpoint
 * @apiName RetrieveCheckpoint
 * @apiGroup Checkpoint
 * @apiSuccess {Object} checkpoint Checkpoint's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Checkpoint not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /checkpoints/:id Update checkpoint
 * @apiName UpdateCheckpoint
 * @apiGroup Checkpoint
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam heartbeats Checkpoint's heartbeats.
 * @apiParam calories Checkpoint's calories.
 * @apiParam GPSPositions Checkpoint's GPSPositions.
 * @apiSuccess {Object} checkpoint Checkpoint's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Checkpoint not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ heartbeats, calories, GPSPositions }),
  update)

/**
 * @api {delete} /checkpoints/:id Delete checkpoint
 * @apiName DeleteCheckpoint
 * @apiGroup Checkpoint
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Checkpoint not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
