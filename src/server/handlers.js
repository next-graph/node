/**
 * Created on 1400/11/25 (2022/2/14).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {fullFormats} from 'ajv-formats/dist/formats.js'
import {endpoints} from './server.js'

// public-dynamic handlers:

export function sayHello(req, res) {
  res.end(`Hello ${req.params.name}`)
}

// private-dynamic handlers:

export function addEndpoint(req, res) {
  const {query: {endpoint}} = req
  if (!fullFormats.url.test(endpoint)) {
    res.badRequest(`Bad URL format: ${JSON.stringify(endpoint)}`)
  }
  
  const endpointsNum = endpoints.size
  endpoints.add(endpoint)
  
  res.end((endpoints.size === endpointsNum
      ? 'The endpoint already exists: '
      : 'The endpoint added: '
  ) + JSON.stringify(endpoint))
}

export function showEndpoints(req, res) {
  res.jsonContentType().end(JSON.stringify([...endpoints]))
}
