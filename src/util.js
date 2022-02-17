/**
 * Created on 1400/11/28 (2022/2/17).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {lstat, readdir} from 'node:fs/promises'

/**
 * {@link https://stackoverflow.com/a/71166133/5318303}
 */
export const deepReadDir = async (dirPath) => await Promise.all(
  (await readdir(dirPath)).map(async (entity) => {
    const path = dirPath + '/' + entity
    return (await lstat(path)).isDirectory() ? await deepReadDir(path) : path
  }),
)
