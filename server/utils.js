/* 
 * 在 server 端读取 client 端的编译结果
 */
import fs from 'fs'
import path from 'path'
import { memoize } from 'lodash'
import internalIp from 'internal-ip'
import packageJson from '../package.json'

const isProd = process.env.NODE_ENV === 'production'

// 读取打包文件
export const getBuildFile = (filename = 'manifest.json', parse = JSON.parse) => {
  const filePath = path.resolve(`build/client/${filename}`)
  const reader = parse(fs.readFileSync(filePath, 'utf8'))
  return isProd ? memoize(reader) : reader
}

// 获取静态资源地址
export const getAssetPath = () => {
  const {project: {devServer: {port}}} = packageJson
  return isProd ? '' : `//${internalIp.v4.sync()}:${port}/`
}