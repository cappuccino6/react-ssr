import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import fetch from 'utils/fetch'
import Header from 'components/Header'
import { withAppContext } from 'hocs/withAppContext'
import moreFetch from 'hocs/moreFetch'

const fetchId = 'moviePage'

class Movie extends React.Component {
  getInitialProps() {
    return Movie.getInitialProps()
  }

  render() {
    const {data = {}} = this.props[fetchId]
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

Movie.getInitialProps = () => fetch('http://3darar.com/api/v1/categories')
Movie.fetchId = fetchId

export default compose(
  hot(module),
  withAppContext(),
  moreFetch({ fetchId })
)(Movie)
