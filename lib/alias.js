'use strict'
const path = require('path')
const base = require('app-root-dir')

module.exports = function createAlias () {
  return Object.assign(
    {},
    {
      'base': base.get(),
      'client':  path.resolve(base.get(), 'client'),
      'server':  path.resolve(base.get(), 'server'),
      'lib':  path.resolve(base.get(), 'lib'),
      'utils':  path.resolve(base.get(), 'client/utils'),
      'hocs':  path.resolve(base.get(), 'client/hocs'),
      'router':  path.resolve(base.get(), 'client/router'),
      'components': path.resolve(base.get(), 'client/components'),
      'pages': path.resolve(base.get(), 'client/pages'),
    }
  )
}
