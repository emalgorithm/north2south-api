import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Checkpoint, { schema } from './model'

const router = new Router()
const { heartRate, calories, distance } = schema.tree

/**
 * @api {post} /checkpoints Create checkpoint
 * @apiName CreateCheckpoint
 * @apiGroup Checkpoint
 * @apiParam heartRate Checkpoint's heartRate.
 * @apiSuccess {Object} checkpoint Checkpoint's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Checkpoint not found.
 */
router.post('/',
  body({ heartRate, calories, distance }),
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
 * @apiParam heartRate Checkpoint's heartRate.
 * @apiSuccess {Object} checkpoint Checkpoint's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Checkpoint not found.
 */
router.put('/:id',
  body({ heartRate, calories, distance }),
  update)

/**
 * @api {delete} /checkpoints/:id Delete checkpoint
 * @apiName DeleteCheckpoint
 * @apiGroup Checkpoint
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Checkpoint not found.
 */
router.delete('/:id',
  destroy)

export default router
