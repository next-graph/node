/**
 * Created on 1400/11/25 (2022/2/14).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {createHash, timingSafeEqual} from 'node:crypto'

const bearerHashBuf = Buffer.from(process.env.bearerHash, 'hex')
const BEARER_PREFIX = 'Bearer '

export function authenticationMiddleware(req, res, next) {
  const {headers: {authorization}} = req
  
  if (!authorization?.startsWith(BEARER_PREFIX))
    return res.unauthorized('Bearer', authorization
      ? `Bad Bearer Authorization. No "${BEARER_PREFIX}" at first.`
      : 'Bearer authorization required.',
    )
  
  const bearerKey = authorization.slice(BEARER_PREFIX.length)
  const providedBearerHashBuf = createHash('sha256').update(bearerKey, 'utf8').digest()
  
  if (!timingSafeEqual(providedBearerHashBuf, bearerHashBuf))
    return res.forbidden(`Invalid authentication key: ${bearerKey}`)
  
  next()
}
