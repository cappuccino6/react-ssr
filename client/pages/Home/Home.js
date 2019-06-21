import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import fetch from 'utils/fetch'
import Header from 'components/Header'
import { withAppContext } from 'hocs/withAppContext'
import moreFetch from 'hocs/moreFetch'

const fetchId = 'homePage'

class Home extends React.Component {

  getInitialProps() {
    return fetch('http://3darar.com/api/v1/categories')
  }

  render() {
    const {data = {}} = this.props[fetchId] || {}
    const {list = []} = data
    return (
      <div>
        <Header />
        {list.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
        this is HomePage
      </div>
    );
  }
}

Home.fetchId = fetchId
Home.getInitialProps = () => fetch('http://3darar.com/api/v1/categories')

export default compose(
  hot(module),
  withAppContext(),
  moreFetch({fetchId})
)(Home)
