

'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const StartServerPlugin = require('start-server-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const ManifestPlugin = require('webpack-manifest-plugin')
// const TerserPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const postcss = require('../postcss')
const paths = require('./paths')
const createAlias = require('./alias')
const config = require('../package.json')

function createEntry(termimal) {
  const isServer = termimal === 'server'
  const mainEntry = isServer ? paths.appServer : paths.appClient
  return isServer ? {
    main: mainEntry
  } : Object.assign({}, {main: mainEntry}, {
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios'
    ]
  })
}

function createWebpackConfig (termimal) {
  const isProd = process.env.NODE_ENV === 'production'
  const isDev = !isProd
  const isServer = termimal === 'server'
  const isClient = termimal === 'client'
  const isDevServer = isDev && isServer
  const isProdClient = isProd && isClient
  const isProdServer = isProd && isServer
  const target = isServer ? 'node' : 'web'

  return {
    bail: isProd,
    mode: isProd ? 'production' : 'development',
    target,
    entry: createEntry(termimal),
    output: {
      filename: `[name]${isProdClient ? '.[chunkhash]' : ''}.js`,
      path: isServer ? paths.buildServer : paths.buildClient,
      publicPath: '',
      libraryTarget: isServer ? 'commonjs2' : 'var',
    },
    node: {
      __dirname: true,
      __filename: true
    },
    resolve: {
      alias: createAlias()
    },
    module: {
      strictExportPresence: true,
      noParse (file) {
        return !/\/cjs\/|react-hot-loader/.test(file) && /\.min\.js/.test(file)
      },
      rules: [
        {
          oneOf: [
            {
              test: /\.(js|jsx)?$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    cacheDirectory: true,
                    compact: isProdClient,
                    highlightCode: true,
                    presets: [
                      path.resolve(__dirname, './babel'),
                      {}
                    ]
                  }
                }
              ]
            },
            {
              test: /\.css$/,
              use: [
                isClient && (isProd ? MiniCssExtractPlugin.loader : 'style-loader'),
                isDevServer && 'isomorphic-style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    localIdentName: '[name]-[local]-[hash:base58:5]',
                    importLoaders: 1,
                    exportOnlyLocals: isProdServer
                  }
                }
              ].filter(Boolean)
            },
            {
              test: /\.(png|jpg|jpeg|gif|image.svg)$/,
              loader: 'file-loader',
              options: {
                name: `${isDev ? '' : '/'}[name].[hash:base58:8].[ext]`,
                emitFile: isClient
              }
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    svgProps: {
                      height: '{props.size || props.height}',
                      width: '{props.size || props.width}',
                      fill: '{props.fill || "currentColor"}'
                    },
                    svgo: false
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    plugins: [
      // isDevServer && new StartServerPlugin({
      //   name: 'server.js',
      //   keyboard: true,
      //   signal: true
      // }),
      isClient && new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
          isProd
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      isDev && new webpack.HotModuleReplacementPlugin(),
      new WebpackBar({
        color: isClient ? '#ff2124' : '#1151fe',
        name: isClient ? 'client' : 'server'
      }),
      isProd && new MiniCssExtractPlugin({
        filename: `${isDev ? '' : '/'}[name].[contenthash].css`
      }),
      isClient && new ManifestPlugin({
        writeToFileEmit: true,
        fileName: `manifest.json`
      }),
      false && isClient && new OpenBrowserPlugin({ url: 'http://localhost:9001' })
    ].filter(Boolean),

    externals: [
      isServer && nodeExternals()
    ].filter(Boolean),

    devServer: {
      allowedHosts: [".localhost"],
      disableHostCheck: false,
      compress: true,
      port: config.project.devServer.port,
      headers: {
        'access-control-allow-origin': '*'
      },
      hot: true,
      publicPath: '',
      historyApiFallback: true
    }
  }
}

module.exports = createWebpackConfig
