import React from 'react'
import path from 'path'
import Mustache from 'mustache'
import {StaticRouter} from 'react-router-dom'
import {renderToString} from 'react-dom/server'
import { getBuildFile, getAssetPath } from './utils'
import template from './template'
import BaseApp from 'lib/baseApp'

class ReactServer extends BaseApp {
  constructor(props) {
    super(props)
  }

  get buildFiles() {
    return getBuildFile()()
  }

  get vendorFiles() {
    return Object.keys(this.buildFiles).filter(key => {
      const item = this.buildFiles[key]
      return path.extname(item) === '.js' || path.extname(item) === '.css'
    })
  }

  get scripts() {
    return this.vendorFiles
    .filter(item => path.extname(item) === '.js')
    .map(item => `<script type="text/javascript" src='${getAssetPath()}${item}'></script>`)
    .reduce((a, b) => a + b, '')
  }

  get css() {
    return this.vendorFiles
    .filter(item => path.extname(item) === '.css')
    .map(item => `<link rel="stylesheet" href='${getAssetPath()}${item}' />`)
    .reduce((a, b) => a + b, '')
  }

  renderTemplate = props => {
    return Mustache.render(template(props))
  }

  renderApp(ctx, context) {
    const html = renderToString((
      <StaticRouter location={ctx.url} context={context}>
        {this.App}
      </StaticRouter>
    ))

    return this.renderTemplate({
      title: '豆瓣', 
      html, 
      scripts: this.scripts, 
      css: this.css
    })
  }
}

export default ReactServer