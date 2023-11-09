//khai báo
import { Router } from 'express'
import { wrapAsync } from '~/utils/handlers'
import { UpdateMeReqBody } from '~/models/requests/User.request'
import { filterMiddleware } from '~/middlewares/common.middleware'
import { accessTokenValidator, refreshTokenValidator } from '../middlewares/users.middlewares'
import {
  loginValidator,
  followValidator,
  registerValidator,
  unfollowValidator,
  updateMeValidator,
  emailVerifyValidator,
  verifiedUserValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
  changePasswordValidator,
  verifyForgotPasswordTokenValidator
} from '../middlewares/users.middlewares'
import {
  oAuthController,
  getMeController,
  loginController,
  logoutController,
  followController,
  updateMeController,
  unfollowController,
  registerController,
  getProfileController,
  emailVerifyController,
  refreshTokenController,
  resetPasswordController,
  forgotPasswordController,
  changePasswordController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapAsync(loginController))

usersRouter.post('/register', registerValidator, wrapAsync(registerController))
/*
des: logout
path: /users/logout
method: POST
Header: {Authorization: Bearer <access_token>}
Body: {refresh_token: string}
*/

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*
des: verify email
khi ng dung dang ky trong mail cua ho se co 1 link
trong link nay da set up san 1 request kem email verify token
 */

usersRouter.post('/verify-email', emailVerifyValidator, wrapAsync(emailVerifyController))

/*
des: resent email verify
method: POST
header: {Authorization: Bearer <access_token>}
 */

usersRouter.post('/resend-email-verify', accessTokenValidator, wrapAsync(resendEmailVerifyController))
/*
des: forgot password 
khi nguoi dung quen mat khau, ho cung cap email cho minh
minh se xem co user nao so huu email do khong, neu co thi minh gui forgot password token va gui vao email cua user do
path: /users/forgot-password */

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: verify forgot password token
nguoi dung sau khi bao forgot password , ho se nhan duoc mail
vao va click link trong email do se co 1 request dinh ekm forgot_password_token
verify cai token nay, neu thanhc ong => reset
method: post
path: users/verify-forgot-password-token */

usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

/*
des: reset password
path: '/reset-password'
method: POST */

usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))

usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

/*
des: get profile của user khác bằng unsername
path: '/:username'
method: get
không cần header vì, chưa đăng nhập cũng có thể xem
*/
usersRouter.get('/:username', wrapAsync(getProfileController))
//chưa có controller getProfileController, nên bây giờ ta làm
/*
des: Follow someone
path: '/follow'
method: post
headers: {Authorization: Bearer <access_token>}
body: {followed_user_id: string}
*/
usersRouter.post('/follow', accessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))
//accessTokenValidator dùng dể kiểm tra xem ngta có đăng nhập hay chưa, và có đc user_id của người dùng từ req.decoded_authorization
//verifiedUserValidator dùng để kiễm tra xem ngta đã verify email hay chưa, rồi thì mới cho follow người khác
//trong req.body có followed_user_id  là mã của người mà ngta muốn follow
//followValidator: kiểm tra followed_user_id truyền lên có đúng định dạng objectId hay không
//  account đó có tồn tại hay không
//followController: tiến hành thao tác tạo document vào collection followers

// 654a274de2d31f72f9f793a2
/*
    des: unfollow someone
    path: '/follow/:user_id'
    method: delete
    headers: {Authorization: Bearer <access_token>}
  g}
    */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapAsync(unfollowController)
)

//unfollowValidator: kiểm tra user_id truyền qua params có hợp lệ hay k?
/*
  des: change password
  path: '/change-password'
  method: PUT
  headers: {Authorization: Bearer <access_token>}
  Body: {old_password: string, password: string, confirm_password: string}
g}
  */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapAsync(changePasswordController)
)
//changePasswordValidator kiểm tra các giá trị truyền lên trên body cớ valid k ?
/*
  des: refreshtoken
  path: '/refresh-token'
  method: POST
  Body: {refresh_token: string}
g}
  */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshTokenController))
//khỏi kiểm tra accesstoken, tại nó hết hạn rồi mà
//refreshController chưa làm

usersRouter.get('/oauth/google', wrapAsync(oAuthController))

export default usersRouter
