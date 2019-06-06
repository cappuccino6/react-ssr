#!/usr/bin/env node
'use strict'
const webpack = require('webpack')
const isEmpty = require('lodash/isEmpty')
const createWebpackConfig = require('../internal/webpackConfig')

for (const termimal of ['client', 'server']) {
  const config = createWebpackConfig(termimal)
  if (isEmpty(config.entry)) {
    continue
  }
  const compiler = webpack(config)
  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    if (stats.compilation.errors && stats.compilation.errors.length) {
      console.error(stats.compilation.errors)
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
}
