import React from 'react'
import fs from 'fs'
import path from 'path'
import Mustache from 'mustache'
import {StaticRouter} from 'react-router-dom'
import {renderToString} from 'react-dom/server'
import routes from 'client/pages'
import { getBuildFile, getAssetPath } from './utils'

function renderTemplate(props) {
  const originHtml = path.join(__dirname, '../public/index.html')
  const templatePath = originHtml
  const template = fs.readFileSync(templatePath, 'utf8');
  return Mustache.render(template, props)
}

const vendorFiles = Object.values(getBuildFile()).filter(item => path.extname(item) === '.js')
const scripts = vendorFiles.map(item => {
  return `<script type="text/javascript" src='${getAssetPath()}${item}'></script>`
})

export const renderApp = (ctx, context)=>{
  const html = renderToString((
    <StaticRouter location={ctx.url} context={context}>
      {routes()}
    </StaticRouter>
  ))
  return renderTemplate({html, scripts, assetPath: getAssetPath()})
}