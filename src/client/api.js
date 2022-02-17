/**
 * Created on 1400/11/26 (2022/2/15).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {OK} from './http-constants.js'
import {storage} from './storage.js'

// noinspection JSUnusedGlobalSymbols
export default class Api {
  static async login(bearerKey) {
    const authorizationHeader = {
      authorization: `Bearer ${bearerKey}`,
    }
    
    const res = await fetch('/showEndpoints', {headers: authorizationHeader})
    
    if (res.status !== OK)
      return await res.text()
    
    storage.authorizationHeader = authorizationHeader
    return 'Logged in'
  }
  
  static logout() {
    delete storage.authorizationHeader
    return 'Logged out'
  }
  
  static async showEndpoints() {
    const res = await fetch('/showEndpoints', {headers: {...storage.authorizationHeader}})
    if (res.status !== OK)
      return await res.text()
    
    return await res.json()
  }
  
  static async addEndpoint(endpoint) {
    const data = await fetch('/hello/world')
    console.log(data)
  }
}
