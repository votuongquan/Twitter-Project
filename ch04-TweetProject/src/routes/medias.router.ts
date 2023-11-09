import { Router } from 'express'
import { wrapAsync } from '~/utils/handlers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'
const mediasRouter = Router()

// mediasRouter.post('/upload-image', wrapAsync(uploadSingleImageController))
mediasRouter.post('/upload-image', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadImageController))
mediasRouter.post('/upload-video', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadVideoController)) // uploadVideoController chưa làm

export default mediasRouter
