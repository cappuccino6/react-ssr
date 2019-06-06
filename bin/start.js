#!/usr/bin/env node
/**
 * 启动两条编译流水线
 */
'use strict'
const debug = require('debug')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn')
const path = require('path')
const webpackConfig = require(path.resolve('internal/webpackConfig'))
// const config = require('config')
const config = require(path.resolve(__dirname, '../package.json'))

const log = debug('react-ssr:start')

function compile (config) {
  let compiler
  try {
    compiler = webpack(config)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  return compiler
}

// 启动 server 线的编译，
// 产出文件由 webpack StartServerPlugin 启动。
const serverConfig = webpackConfig('server')
const serverCompiler = compile(serverConfig)
let triedOpenBrowser = false
serverCompiler.watch(
  {
    quiet: true,
    stats: 'none'
  },
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log('======server error')
      console.error(err || stats.toJson('minimal'))
      return
    }
    console.log('======server success')
    log('Webpack compile done (server js).')
    if (!triedOpenBrowser) {
      try {
        setTimeout(
          opn.bind(null, `http://localhost:${config.project.port}`),
          1500 // 为 server 启动等一下下
        )
      } catch (_) {}
      triedOpenBrowser = true
    }
  }
)

// 启动 client 线的编译
const clientConfig = webpackConfig('client')
if (Object.keys(clientConfig.entry).length > 0) {
  const clientCompiler = compile(clientConfig)
  const clientDevServer = new WebpackDevServer(
    clientCompiler,
    clientConfig.devServer
  )
  clientDevServer.listen(config.project.devServer.port)
} else {
  log('No client side apps to compile.')
}
