import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import fetch from 'utils/fetch'
import Header from 'components/Header'
import ArticleCell from 'components/ArticleCell'
import { withAppContext } from 'hocs/withAppContext'
import moreFetch from 'hocs/moreFetch'
import withStyle from 'hocs/withStyle'
import css from './JueJin.css'

const fetchId = 'juejin'

class JueJin extends React.Component {

  getInitialProps() {
    return JueJin.getInitialProps()
  }

  render() {
    const { data = {} } = this.props[fetchId] || {}
    const articleData = data.data || {}

    if(!articleData.articleFeed) return null

    const { articleFeed: {items: {edges = []}} } = articleData

    return (
      <div className={css.root}>
        <Header />
        <div className={css.articles}>
          {edges.map(_ => (
            <ArticleCell key={_.node.id} data={_.node} />
          ))}
        </div>
      </div>
    );
  }
}

JueJin.fetchId = fetchId
JueJin.getInitialProps = () => fetch('https://web-api.juejin.im/query', {
  method: 'POST',
  json: {
    extensions: {query: {id: '653b587c5c7c8a00ddf67fc66f989d42'}},
    operationName: '',
    query: '',
    variables: {limit: 100, category: '5562b415e4b00c57d9b94ac8', after: '', order: 'POPULAR', first: 20}
  },
  headers: {
    'X-Agent': 'Juejin/Web',
    'X-Legacy-Device-Id': '1559199715822',
    'X-Legacy-Token': 'eyJhY2Nlc3NfdG9rZW4iOiJoZ01va0dVNnhLV1U0VGtqIiwicmVmcmVzaF90b2tlbiI6IkczSk81TU9QRjd3WFozY2IiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ==',
    'X-Legacy-Uid': '5c9449c15188252d9179ce68'
  }
})

export default compose(
  hot(module),
  withAppContext(),
  withStyle(css),
  moreFetch({fetchId})
)(JueJin)
