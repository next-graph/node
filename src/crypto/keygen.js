#!/usr/bin/env -S node
/**
 * Created on 1400/10/12 (2022/1/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {E, R, T} from 'ansi-colors-and-styles'
import crypto from 'node:crypto'
import {mkdir} from 'node:fs/promises'
import {resolve} from 'node:path'
import util from 'node:util'
import {secretAsk} from '../util/prompt.js'
import safeWriteFile from '../util/safeWriteFile.js'

const generateKeyPair = util.promisify(crypto.generateKeyPair)

const passphrase = await secretAsk('Enter a passphrase (will be hidden): ')

const {privateKey, publicKey} = await generateKeyPair('ed25519', {
  privateKeyEncoding: {format: 'pem', type: 'pkcs8', cipher: 'aes-256-cbc', passphrase},
  publicKeyEncoding: {format: 'pem', type: 'spki'},
})

const keysPath = resolve('keys')
await mkdir(keysPath).catch(err => { if (err.code !== 'EEXIST') throw err })

// Do writes in series (one after another) (because of probable prompts):

await safeFileWriter('passphrase.txt', passphrase, 'Passphrase')
console.log(`${R}CAVEAT: DON'T KEEP THIS FILE AND YOUR PRIVATE-KEY IN THE SAME PLACE!${T}`)

await safeFileWriter('private.key', privateKey, 'Private key')

await safeFileWriter('public.key', publicKey, 'Public key')

//*********************************************************************************************************************/

async function safeFileWriter(fileName, data, name) {
  const filePath = resolve(keysPath, fileName)
  
  await safeWriteFile(filePath, data, name).catch(_ => {
    console.log('Move the existed file to another place and try again.')
    process.exit(0)
  })
  
  // trailing colon (after `filePath`) is to make the path CLICKABLE in IntelliJ IDEA console
  console.log(`\n${E}${name} => ${filePath}:${T}`)
}
