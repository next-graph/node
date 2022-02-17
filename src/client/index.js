/**
 * Created on 1400/11/26 (2022/2/15).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import Api from './api.js'

Object.entries(
  Object.getOwnPropertyDescriptors(Api),
).forEach(([prop, {value}]) => {
  if (typeof value === 'function') // Globalize static methods of `Api`:
    globalThis[prop] = value
})
