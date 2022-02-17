/**
 * Created on 1400/10/12 (2022/1/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import cero from '0http'
import sequential from '0http/lib/router/sequential.js'
import {INTERNAL_SERVER_ERROR} from '../client/http-constants.js'
import {authenticationMiddleware} from './authentication.js'
import {addEndpoint, sayHello, showEndpoints} from './handlers.js'
import {setUsefulMethods} from './quick-response.js'
import files from './static-resources.js'

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

// // special routes:
router.get('/', files['/index.html'].serve)

// // general routes:
for (const filesKey in files) // serve all files in `files` (located in `./src/client` (recursively)):
  router.get(filesKey, files[filesKey].serve)

// public routes:

router.get('/hello/:name', sayHello)

// private routes:

router.post('/addEndpoint', authenticationMiddleware, addEndpoint)

router.get('/showEndpoints', authenticationMiddleware, showEndpoints)

// start the server:

const PORT = 3333
server.listen(PORT, err => {
  if (err) throw err
  console.log(`Server listening on: http://localhost:${PORT}`)
})
