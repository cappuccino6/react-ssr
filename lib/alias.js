'use strict'
const path = require('path')
const base = require('app-root-dir')
const resolveApp = relativePath => path.resolve(base.get(), relativePath)

module.exports = Object.assign(
  {},
  {
    'base': base.get(),
    'baseHtml': resolveApp('public/index.html'),
    'packageJson': resolveApp('package.json'),
    'client': resolveApp('client'),
    'server': resolveApp('server'),
    'store': resolveApp('store'),
    'lib': resolveApp('lib'),
    'buildClient': resolveApp('build/client'),
    'buildServer': resolveApp('build/server'),
    'config': resolveApp('client/config'),
    'utils': resolveApp('client/utils'),
    'hocs': resolveApp('client/hocs'),
    'router': resolveApp('client/router'),
    'components': resolveApp('client/components'),
    'pages': resolveApp('client/pages')
  }
)
