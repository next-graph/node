/**
 * Created on 1400/11/27 (2022/2/16).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {readFile} from 'node:fs/promises'
import {extname} from 'node:path'
import {promisify} from 'node:util'
import {brotliCompress as brCompress} from 'node:zlib'
import {ACCEPT_ENCODING, CONTENT_ENCODING, CONTENT_LENGTH, CONTENT_TYPE} from './http-constants.js'

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

const filesPromises = { // Run promises in parallel:
  indexHtml: resolveFile('src/index.html'),
  indexJs: resolveFile('src/index.js'),
  apiJs: resolveFile('src/api.js'),
  faviconIco: resolveFile('res/favicon.ico'),
}

/**
 * @example
 * {
 *  indexHtml: {
 *    path: 'src/index.html',
 *    mimeType: 'text/html; charset=UTF-8',
 *    encoding: 'br',
 *    buffer: <Buffer 1b 46 01 80 8c 93 ... 85 more bytes>,
 *    serve: [Function: bound sendFile],
 *  },
 *  indexJs: {
 *    // ...
 *   }
 * }
 */
const files = {}
for (const fileKey in filesPromises) { // await all:
  files[fileKey] = await filesPromises[fileKey]
}

export const {indexHtml, indexJs, apiJs, faviconIco} = files

async function resolveFile(path) {
  const rawBuffer = await readFile(path)
  const {mimeType, encoding} = fileTypesInfo[extname(path).slice(1) /* omit leading dot */]
  const buffer = encoding === 'br' ? await brotliCompress(rawBuffer) : rawBuffer
  return {
    path,
    mimeType,
    encoding,
    buffer,
    serve: sendFile.bind(null, mimeType, encoding, buffer),
  }
}

export function sendFile(mimeType, encoding, buffer, req, res) {
  res.setHeader(CONTENT_TYPE, mimeType)
  res.setHeader(CONTENT_LENGTH, buffer.length)
  
  if (encoding) {
    if (!req.headers[ACCEPT_ENCODING.toLowerCase()]?.split(',').find(acceptedEncoding =>
      [encoding, '*'].includes(
        acceptedEncoding.trim().split(';')[0].trim().toLowerCase(),
      ),
    ))
      return res.notAcceptable(`No accepted encoding matches: "${encoding}"`)
    
    res.setHeader(CONTENT_ENCODING, encoding)
  }
  
  res.end(buffer)
}
