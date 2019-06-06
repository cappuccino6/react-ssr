'use strict'
const path = require('path')
const base = require('app-root-dir')

module.exports = function createAlias () {
  return Object.assign(
    {},
    {
      'base': base.get(),
      'config':  path.resolve(base.get(), 'package.json'),
      'client':  path.resolve(base.get(), 'client'),
      'server':  path.resolve(base.get(), 'server'),
      'internal':  path.resolve(base.get(), 'internal'),
      'router':  path.resolve(base.get(), 'client/router'),
      'components': path.resolve(base.get(), 'client/components'),
      'pages': path.resolve(base.get(), 'client/pages'),
    }
  )
}
