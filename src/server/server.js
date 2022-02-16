/**
 * Created on 1400/10/12 (2022/1/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import cero from '0http'
import sequential from '0http/lib/router/sequential.js'
import {authenticationMiddleware} from './authentication.js'
import {addEndpoint, sayHello, showEndpoints} from './handlers.js'
import {INTERNAL_SERVER_ERROR} from './http-constants.js'
import {setUsefulMethods} from './quick-response.js'
import {apiJs, faviconIco, indexHtml, indexJs} from './static-resources.js'

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

router.use('/', setUsefulMethods)

// static routes (public):

router.get('/', indexHtml.serve)
router.get('/index.html', indexHtml.serve)

router.get('/index.js', indexJs.serve)
router.get('/api.js', apiJs.serve)

router.get('/res/favicon.ico', faviconIco.serve)

// public routes:

router.get('/hello/:name', sayHello)

// private routes:

router.post('/addEndpoint', authenticationMiddleware, addEndpoint)

router.get('/showEndpoints', authenticationMiddleware, showEndpoints)

// start server:

const PORT = 3333
server.listen(PORT, err => {
  if (err) throw err
  console.log(`Server listening on: http://localhost:${PORT}`)
})
