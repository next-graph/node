import {createHash, timingSafeEqual} from 'node:crypto'
import {FORBIDDEN, UNAUTHORIZED} from './http-status-codes.js'

const bearerHashBuf = Buffer.from(process.env.bearerHash, 'hex')
const BEARER_PREFIX = 'Bearer '

export function authenticationMiddleware(req, res, next) {
  const {headers: {authorization}} = req
  
  if (!authorization?.startsWith(BEARER_PREFIX))
    return res.status(UNAUTHORIZED).headers({'WWW-Authenticate': 'Bearer'}).end(authorization
      ? `Bad Bearer Authorization. No "${BEARER_PREFIX}" at first.`
      : 'Bearer authorization required.',
    )
  
  const bearerKey = authorization.slice(BEARER_PREFIX.length)
  const providedBearerHashBuf = createHash('sha256').update(bearerKey, 'utf8').digest()
  
  if (!timingSafeEqual(providedBearerHashBuf, bearerHashBuf))
    return res.status(FORBIDDEN).end(`Invalid authentication key: ${bearerKey}`)
  
  next()
}
