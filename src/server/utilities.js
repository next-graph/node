/**
 * Created on 1400/11/25 (2022/2/14).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

export function setResponseStatusCodeAndMessage(statusCode, statusMessage = undefined) { // noinspection JSUnusedGlobalSymbols:
  this.statusCode = statusCode
  if (statusMessage !== undefined) // noinspection JSUnusedGlobalSymbols:
    this.statusMessage = statusMessage
  return this
}

export function setResponseHeaders(headers) {
  for (const [headerKey, headerValue] of Object.entries(headers)) {
    this.setHeader(headerKey, headerValue)
  }
  return this
}

export function setContentType(contentType) {
  this.setHeader('Content-Type', contentType)
  return this
}

export function setJsonContentType() {
  this.setHeader('Content-Type', 'application/json')
  return this
}

export function setHtmlContentType() {
  this.setHeader('Content-Type', 'text/html; charset=UTF-8')
  return this
}

export function setJsContentType() {
  this.setHeader('Content-Type', 'text/javascript')
  return this
}
