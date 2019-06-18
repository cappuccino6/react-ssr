/**
 * You may need to delete /node_modules/.cache or
 * disable `cacheDirectory` of babel-loader to make
 * new version of this file take effect.
 */
'use strict'

module.exports = function createPreset (_, opts) {
  if (!opts) {
    opts = {}
  }

  const isDev = opts.env !== 'production'
  const isNode = opts.target === 'node'
  const modern = opts.modern === true
  const isClient = !isNode

  return {
    presets: [
      isNode && [
        require('@babel/preset-env').default,
        {
          targets: {
            node: 'current'
          },
          modules: false
        }
      ],
      isClient && [
        require('@babel/preset-env').default,
        {
          targets: {
            // https://www.npmjs.com/package/babel-preset-modern-browsers#compatibility-table
            // https://github.com/browserslist/browserslist
            browsers: modern ? 'chrome >= 66, iOS >= 11.1' : 'defaults'
          },
          useBuiltIns: 'entry',
          modules: false
        }
      ],
      [
        require('@babel/preset-react').default,
        {
          development: isDev || isNode,
          useBuiltIns: true
        }
      ]
    ].filter(Boolean),

    plugins: [
      // react-hot-loader/babel causing errors, disabled.
      // isDev && isClient && 'react-hot-loader/babel',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      isNode && 'babel-plugin-transform-dynamic-import',
      isClient && [
        require('@babel/plugin-transform-runtime').default,
        {
          helpers: false,
          regenerator: true
        }
      ],
      'babel-plugin-lodash'
    ].filter(Boolean)
  }
}
