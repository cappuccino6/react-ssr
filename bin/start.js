#!/usr/bin/env node
/**
 * 启动两条编译流水线
 */
'use strict'
const debug = require('debug')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const open = require('open')
const path = require('path')
const webpackConfig = require(path.resolve('internal/webpackConfig'))
const config = require(path.resolve(__dirname, '../package.json'))

const log = debug('ssr:compile')

function compile (config) {
  let compiler
  try {
    log('compile start')
    compiler = webpack(config)
  } catch (e) {
    log('compile error')
    process.exit(1)
  } finally {
    log('compile end')
  }
  return compiler
}

// 启动 server 线的编译，
// 产出文件由 webpack StartServerPlugin 启动。
const serverConfig = webpackConfig('server')
const serverCompiler = compile(serverConfig)
serverCompiler.watch(
  {
    quiet: true,
    stats: 'none'
  },
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err || stats.toJson('minimal'))
      return
    } else {
      // open(`http://localhost:${config.project.port}`)
    }
  }
)

// 启动 client 线的编译
const clientConfig = webpackConfig('client')
const clientCompiler = compile(clientConfig)
const clientDevServer = new WebpackDevServer(
  clientCompiler,
  clientConfig.devServer
)
clientDevServer.listen(config.project.devServer.port, err => {
  if (err) {
    console.error(err)
  }
})