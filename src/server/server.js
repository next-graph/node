import cero from '0http'
import sequential from '0http/lib/router/sequential.js'
import {authenticationMiddleware} from './authentication.js'
import {
  addEndpoint,
  apiJs,
  indexHtml,
  indexJs,
  sayHello,
  serveHtmlFile,
  serveJsFile,
  showEndpoints,
} from './handlers.js'
import {INTERNAL_SERVER_ERROR} from './http-status-codes.js'
import {
  setContentType,
  setHtmlContentType,
  setJsContentType,
  setJsonContentType,
  setResponseHeaders,
  setResponseStatusCodeAndMessage,
} from './utilities.js'

/**
 * Created on 1400/10/12 (2022/1/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

export const endpoints = new Set(process.env.endpoints?.split(' '))

// noinspection JSUnusedGlobalSymbols
const {router, server} = cero({
  router: sequential({
    errorHandler(err, req, res) {
      console.error(err)
      res.statusCode = INTERNAL_SERVER_ERROR
      res.end(err.message)
    },
  }),
})

// global middlewares:

router.use('/', (req, res, next) => { // Set useful methods:
  res.status = setResponseStatusCodeAndMessage
  res.headers = setResponseHeaders
  res.contentType = setContentType
  res.jsonContentType = setJsonContentType
  res.htmlContentType = setHtmlContentType
  res.jsContentType = setJsContentType
  next()
})

// public-static routes:

const serveIndexHtml = serveHtmlFile.bind(null, indexHtml)
router.get('/', serveIndexHtml)
router.get('/index.html', serveIndexHtml)

router.get('/index.js', serveJsFile.bind(null, indexJs))
router.get('/api.js', serveJsFile.bind(null, apiJs))

// public-dynamic routes:

router.get('/hello/:name', sayHello)

// private-dynamic routes:

router.use('/', authenticationMiddleware)

router.get('/addEndpoint', addEndpoint)

router.get('/showEndpoints', showEndpoints)

// start server:

const PORT = 3333
server.listen(PORT, err => {
  if (err) throw err
  console.log(`Server listening on: http://localhost:${PORT}`)
})
