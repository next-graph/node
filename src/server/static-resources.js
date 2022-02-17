/**
 * Created on 1400/11/27 (2022/2/16).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {readFile} from 'node:fs/promises'
import {extname} from 'node:path'
import {promisify} from 'node:util'
import {brotliCompress as brCompress} from 'node:zlib'
import {ACCEPT_ENCODING, CONTENT_ENCODING, CONTENT_LENGTH, CONTENT_TYPE} from '../client/http-constants.js'
import {deepReadDir} from '../util.js'

const brotliCompress = promisify(brCompress)

export const fileTypesInfo = {
  html: {
    mimeType: 'text/html; charset=UTF-8',
    encoding: 'br',
  },
  js: {
    mimeType: 'application/javascript; charset=utf-8',
    encoding: 'br',
  },
  json: {
    mimeType: 'application/json',
    encoding: 'br',
  },
  ico: {mimeType: 'image/x-icon'},
}

const clientPath = 'src/client'
const paths = (await deepReadDir(clientPath)).flat(Number.POSITIVE_INFINITY)

/**
 * @example
 * {
 *  '/index.html': {
 *    path: 'src/client/index.html',
 *    mimeType: 'text/html; charset=UTF-8',
 *    encoding: 'br',
 *    buffer: <Buffer 1b 46 01 80 8c 93 ... 85 more bytes>,
 *    serve: [Function: bound sendFile],
 *  },
 *  '/index.js': {
 *    // ...
 *   },
 *  '/res/favicon.ico': {
 *    // ...
 *   },
 * }
 */
const files = Object.fromEntries(await Promise.all(
  paths.map(async (filePath) => [
    filePath.slice(clientPath.length), // `fileKey`, ex. "/index.html", "/res/favicon.ico", ...
    await resolveFile(filePath), // file entity. See the above @example
  ]),
))

export default files

async function resolveFile(path) {
  const rawBuffer = await readFile(path)
  const {mimeType, encoding} = fileTypesInfo[extname(path).slice(1) /* omit leading dot */]
  const buffer = encoding === 'br' ? await brotliCompress(rawBuffer) : rawBuffer
  const file = {
    path,
    mimeType,
    encoding,
    buffer,
    serve: sendFile, // is here just for type
  }
  file.serve = sendFile.bind(file)
  return file
}

function sendFile(req, res) {
  res.setHeader(CONTENT_TYPE, this.mimeType)
  res.setHeader(CONTENT_LENGTH, this.buffer.length)
  
  if (this.encoding) {
    if (!req.headers[ACCEPT_ENCODING.toLowerCase()]?.split(',').find(acceptedEncoding =>
      [this.encoding, '*'].includes(
        acceptedEncoding.trim().split(';')[0].trim().toLowerCase(),
      ),
    )) {
      return res.notAcceptable(`No accepted encoding matches: "${this.encoding}"`)
    }
    res.setHeader(CONTENT_ENCODING, this.encoding)
  }
  
  res.end(this.buffer)
}
