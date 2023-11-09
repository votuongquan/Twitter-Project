import exp from 'constants'
import express from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)

    const errors = validationResult(req)
    const errorObjects = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    if (errors.isEmpty()) {
      return next()
    }
    for (const key in errorObjects) {
      const { msg } = errorObjects[key]
      if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = msg
    }

    next(entityError)
  }
}
