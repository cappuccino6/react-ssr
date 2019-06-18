'use strict'
const debug = require('debug')('ssr:build')
const webpack = require('webpack')
const isEmpty = require('lodash/isEmpty')
const createWebpackConfig = require('../lib/webpackConfig')

// 启动两条打包流水线
const termimals = ['client', 'server']

termimals.forEach(termimal => {
  const config = createWebpackConfig(termimal)
  if (isEmpty(config.entry)) {
    debug(`webpack entry of terminal ${termimal} can not be empty`)
    return
  }
  const compiler = webpack(config)
  compiler.run((err, stats) => {
    if (err || (stats.compilation.errors && stats.compilation.errors.length)) {
      debug(`some error occured`)
      process.exit(1)
    }
    console.log(
      stats.toString({
        chunks: false,
        children: false,
        modules: false,
        colors: true,
        warnings: true,
        errors: true,
        excludeAssets: [/.map$/]
      })
    )
  })
})
