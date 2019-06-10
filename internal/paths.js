'use strict';

const path = require('path')
const appDirectory = path.join(__dirname, '../')
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appBuild: resolveApp('build'),
  buildClient: resolveApp('build/client'),
  buildServer: resolveApp('build/server'),
  appPublic: resolveApp('public'),
  appInternal: resolveApp('internal'),
  appHtml: resolveApp('public/index.html'),
  appPackageJson: resolveApp('package.json'),
  appClient: resolveApp('client/index.js'),
  appServer: resolveApp('server/index.js'),
  appNodeModules: resolveApp('node_modules'),
};
