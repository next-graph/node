import {fullFormats} from 'ajv-formats/dist/formats.js'
import {BAD_REQUEST} from './http-status-codes.js'
import {endpoints} from './server.js'

// public handlers:

export function sayHello(req, res) {
  res.end(`Hello ${req.params.name}`)
}

// private handlers:

export function addEndpoint(req, res) {
  const {query: {endpoint}} = req
  if (!fullFormats.url.test(endpoint)) {
    res.status(BAD_REQUEST).end(`Bad URL format: ${JSON.stringify(endpoint)}`)
  }
  
  const endpointsNum = endpoints.size
  endpoints.add(endpoint)
  
  res.end((endpoints.size === endpointsNum
      ? 'The endpoint already exists: '
      : 'The endpoint added: '
  ) + JSON.stringify(endpoint))
}

export function showEndpoints(req, res) {
  res.headers({'Content-Type': 'application/json'}).end(JSON.stringify([...endpoints]))
}
