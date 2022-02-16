/**
 * Created on 1400/11/25 (2022/2/14).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {fullFormats} from 'ajv-formats/dist/formats.js'
import {ALREADY_REPORTED, CONTENT_TYPE, CREATED} from './http-constants.js'
import {endpoints} from './server.js'
import {fileTypesInfo} from './static-resources.js'

// public handlers:

export function sayHello(req, res) {
  res.end(`Hello ${req.params.name}`)
}

// private handlers:

export async function addEndpoint(req, res) {
  const data = await resolveJsonBody(req, res, 10 * 1024)
  if (data === undefined) return
  
  const {endpoint} = data
  if (!fullFormats.url.test(endpoint))
    return res.badRequest(`Bad URL format: ${JSON.stringify(endpoint)}`)
  
  const endpointsNum = endpoints.size
  endpoints.add(endpoint)
  const alreadyExisted = endpoints.size === endpointsNum
  
  res
    .status(alreadyExisted ? ALREADY_REPORTED : CREATED)
    .end((alreadyExisted
        ? 'The endpoint already exists: '
        : 'The endpoint added: '
    ) + JSON.stringify(endpoint))
}

export function showEndpoints(req, res) {
  res.jsonContentType().end(JSON.stringify([...endpoints]))
}

//*********************************************************************************************************************/

async function resolveJsonBody(req, res, maxAllowedSize = 100 * 1024) {
  if (req.headers[CONTENT_TYPE.toLowerCase()]?.split(';')[0].trim() !== fileTypesInfo.json.mimeType)
    return res.notAcceptable(
      `Only "${fileTypesInfo.json.mimeType}" content-type is acceptable. ` +
      `received: ${JSON.stringify(req.headers[CONTENT_TYPE.toLowerCase()])}`,
    )
  
  const buffers = []
  let payloadSize = 0
  for await (const chunk of req) {
    payloadSize += chunk.length
    if (payloadSize > maxAllowedSize)
      return res.payloadTooLarge(`Too large payload size >= ${payloadSize}`)
    buffers.push(chunk)
  }
  const payload = Buffer.concat(buffers).toString()
  
  try {
    return JSON.parse(payload)
  } catch (e) {
    return res.badRequest(e.message)
  }
}
