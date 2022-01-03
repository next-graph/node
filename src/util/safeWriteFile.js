import {B, T} from 'ansi-colors-and-styles'
import {open, writeFile} from 'node:fs/promises'
import {basename} from 'node:path'
import {ask} from './prompt.js'

/**
 * Created on 1400/10/13 (2022/1/3).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

export default async function safeWriteFile(filePath, data, name = basename(filePath)) {
  return await new Promise((resolve, reject) => {
    // https://nodejs.org/api/fs.html#fsaccesspath-mode-callback -> [write (RECOMMENDED)]
    open(filePath, 'wx').then(async fd => {
      await fd.writeFile(data)
      await fd.close()
      resolve(0)
    }).catch(async err => {
      if (err.code !== 'EEXIST') throw err
      
      const answer = await ask('\n' +
        `${B}${name} file (${filePath}:) ALREADY EXISTS! Do you want to OVERWRITE it [y/N]? ${T}`,
      )
      
      if (answer.toLowerCase() !== 'y') return reject(err)
      
      await writeFile(filePath, data, {flag: 'w'}) // https://nodejs.org/api/fs.html#file-system-flags
      resolve(1)
    })
  })
}
