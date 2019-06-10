import React from 'react'
import fs from 'fs'
import path from 'path'
import {StaticRouter} from 'react-router-dom'
import {renderToString} from 'react-dom/server'
import routes from '../client/pages'

// 正则匹配模版中的 {{}}
function renderTemplate(props) {
  const template = fs.readFileSync(path.join(__dirname, './template.html'), 'utf-8');
  return template.replace(/{{([\s\S]*?)}}/g, (_, key) => props[ key.trim() ]);
}

export const renderApp = (ctx, context)=>{
  const content = renderToString((
    <StaticRouter location={ctx.url} context={context}>
      {routes()}
    </StaticRouter>
  ))
  return renderTemplate({title: 'SSR', root: content})
}