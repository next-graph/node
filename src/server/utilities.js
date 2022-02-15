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
