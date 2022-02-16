/**
 * Created on 1400/11/25 (2022/2/14).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {
  BAD_REQUEST,
  CONTENT_ENCODING,
  CONTENT_LENGTH,
  CONTENT_TYPE,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  UNAUTHORIZED,
  WWW_AUTHENTICATE,
} from './http-constants.js'
import {fileTypesInfo} from './static-resources.js'

// ********************************************************************************************************************/

export function setResponseHeaders(headers) {
  for (const [headerKey, headerValue] of Object.entries(headers)) {
    this.setHeader(headerKey, headerValue)
  }
  return this
}

// ********************************************************************************************************************/

export function setContentType(contentType) {
  this.setHeader(CONTENT_TYPE, contentType)
  return this
}

export function setJsonContentType() {
  this.setHeader(CONTENT_TYPE, fileTypesInfo.json.mimeType)
  return this
}

export function setHtmlContentType() {
  this.setHeader(CONTENT_TYPE, fileTypesInfo.html.mimeType)
  return this
}

export function setJsContentType() {
  this.setHeader(CONTENT_TYPE, fileTypesInfo.js.mimeType)
  return this
}

// ********************************************************************************************************************/

export function sendFile(file) {
  this.setHeader(CONTENT_TYPE, file.mimeType)
  this.setHeader(CONTENT_LENGTH, file.buffer.length)
  if (file.encoding)
    this.setHeader(CONTENT_ENCODING, file.encoding)
  this.end(file.buffer)
}

// ********************************************************************************************************************/

export function setResponseStatusCodeAndMessage(statusCode, statusMessage = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = statusCode
  if (statusMessage !== undefined) // noinspection JSUnusedGlobalSymbols:
    this.statusMessage = statusMessage
  return this
}

export function created(message = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = CREATED
  this.end(message)
}

export function badRequest(message = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = BAD_REQUEST
  this.end(message)
}

export function unauthorized(wwwAuthenticate = undefined, message = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = UNAUTHORIZED
  if (wwwAuthenticate !== undefined)
    this.setHeader(WWW_AUTHENTICATE, wwwAuthenticate)
  this.end(message)
}

export function forbidden(message = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = FORBIDDEN
  this.end(message)
}

export function notFound(message = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = NOT_FOUND
  this.end(message)
}

export function notAcceptable(message = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = NOT_ACCEPTABLE
  this.end(message)
}

export function internalServerError(message = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = INTERNAL_SERVER_ERROR
  this.end(message)
}
