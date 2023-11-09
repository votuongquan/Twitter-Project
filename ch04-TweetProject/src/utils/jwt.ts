import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.request'
config()

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      resolve(token as string)
    })
  })
}

// ham ktra token co phai hop le khong
// neu hop le thi tra ve payload
// neu khong hop le thi throw error
export const verifyToken = ({ token, secretOrPublickey }: { token: string; secretOrPublickey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublickey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayload)
    })
  })
}
