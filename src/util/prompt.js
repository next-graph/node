import readline from 'node:readline'
import {Writable} from 'node:stream'

/**
 * Created on 1400/10/13 (2022/1/3).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

/**
 * @param {string} query
 * @return {Promise<string>}
 */
export async function ask(query) {
  const rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: true})
  
  return await new Promise(resolve => {
    rl.question(query, (answer) => {
      resolve(answer)
      rl.close()
    })
  })
}

/**
 * @type {function(string): Promise<string>}
 */
export const secretAsk = (() => {
  // https://stackoverflow.com/questions/24037545/how-to-hide-password-in-the-nodejs-console#answer-33500118
  const mutableStdout = new Writable({
    muted: false,
    write(chunk, encoding, callback) {
      if (!this.muted || ['\n', '\r\n'].includes(chunk.toString())) {
        process.stdout.write(chunk, encoding)
      }
      callback()
    },
  })
  
  const rl = readline.createInterface({input: process.stdin, output: mutableStdout, terminal: true})
  
  return async (query) => await new Promise(resolve => {
    rl.question(query, (secret) => {
      resolve(secret)
      rl.close()
    })
    mutableStdout.muted = true
  })
})()
