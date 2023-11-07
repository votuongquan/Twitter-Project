// Doan code nay lay tu tranh chu cua sha256

import { createHash } from 'crypto'
import { config } from 'dotenv'
config()

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

// ham ma hoa password
export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}
