import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import HighRateMovie from './HighRateMovie'
import JueJin from './JueJin'

export const routes = [
  {
    path: '/high-rate-movie',
    name: '高分电影',
    component: HighRateMovie
  },
  {
    path: '/juejin',
    name: '文章',
    component: JueJin
  }
]

export default () => (
  <Switch>
    {routes.map(r => <Route key={r.path} {...r} />)}
  </Switch>
)