import React from 'react'
import {Route, Switch} from 'router'
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
    name: '掘金',
    component: JueJin
  },
  {
    path: '/',
    component: HighRateMovie
  }
]

export default () => (
  <Switch>
    {routes.map(r => (
      <Route
        key={r.path}
        path={r.path}
        component={r.component}
      />
    ))}
  </Switch>
)