import {fullFormats} from 'ajv-formats/dist/formats.js'
import {readFile} from 'node:fs/promises'
import {BAD_REQUEST} from './http-status-codes.js'
import {endpoints} from './server.js'

/**
 * Created on 1400/11/25 (2022/2/14).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */
  
  // public-static handlers:

export const [indexHtml, indexJs, apiJs] = await Promise.all([
    readFile('src/index.html'),
    readFile('src/index.js'),
    readFile('src/api.js'),
  ])

export function serveHtmlFile(fileBuffer, req, res) {
  res.htmlContentType().end(fileBuffer)
}

export function serveJsFile(fileBuffer, req, res) {
  res.jsContentType().end(fileBuffer)
}

// public-dynamic handlers:

export function sayHello(req, res) {
  res.end(`Hello ${req.params.name}`)
}

// private-dynamic handlers:

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
  res.jsonContentType().end(JSON.stringify([...endpoints]))
}
