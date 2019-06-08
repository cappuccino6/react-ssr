// import Koa from 'koa'
// import React from 'react'
// import fs from 'fs'
// import path from 'path'
// import { renderToString } from 'react-dom/server'
// import App from '../client/App'

// const app = new Koa()

// // 正则匹配模版中的 {{}}
// function renderTemplate(props) {
//   const template = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8');
//   return template.replace(/{{([\s\S]*?)}}/g, (_, key) => props[ key.trim() ]);
// }

// console.log('====server action')

// app.use(ctx => {
//   const root = renderToString(<App />)
//   ctx.body = renderTemplate({root, title: 'SSR'})
// })

// app.listen(8971)

/* global DEV_APPS_SERVER_REGEXP */
'use strict'
const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const React = require('react')
const bodyParser = require('koa-bodyparser')
const config = require(path.resolve(__dirname, '../package.json'))
const routes = require('./routes')
const { renderToString } = require('react-dom/server')

const App = () => <div>Hello Koa SSR</div>

// 正则匹配模版中的 {{}}
function renderTemplate(props) {
  const template = fs.readFileSync(path.join(__dirname, './template.html'), 'utf-8');
  return template.replace(/{{([\s\S]*?)}}/g, (_, key) => props[ key.trim() ]);
}

const app = new Koa()
app.use(routes.routes(), routes.allowMethods())
app.proxy = true
app.use(bodyParser({
  jsonLimit: '8mb'
}))

app.use(ctx => {
  const root = renderToString(<App />)
  ctx.body = renderTemplate({root, title: 'SSR'})
})

app.listen(process.env.PORT || config.project.port)
