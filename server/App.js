import React from 'react'
import path from 'path'
import Mustache from 'mustache'
import {StaticRouter} from 'react-router-dom'
import {renderToString} from 'react-dom/server'
import routes from 'client/pages'
import { getBuildFile, getAssetPath } from './utils'
import template from './template'

function renderTemplate(props) {
  return Mustache.render(template(props))
}

// 读取客户端打包的文件
const buildFiles = getBuildFile()()
const vendorFiles = Object.keys(buildFiles).filter(key => {
  const item = buildFiles[key]
  return path.extname(item) === '.js' || path.extname(item) === '.css'
})

const scripts = vendorFiles
  .filter(item => path.extname(item) === '.js')
  .map(item => `<script type="text/javascript" src='${getAssetPath()}${item}'></script>`)
  .reduce((a, b) => a + b, '')

const css = vendorFiles
  .filter(item => path.extname(item) === '.css')
  .map(item => `<link rel="stylesheet" href='${getAssetPath()}${item}' />`)
  .reduce((a, b) => a + b, '')

export const renderApp = (ctx, context)=>{
  const html = renderToString((
    <StaticRouter location={ctx.url} context={context}>
      {routes()}
    </StaticRouter>
  ))
  return renderTemplate({title: '豆瓣', html, scripts, css, assetPath: getAssetPath()})
}