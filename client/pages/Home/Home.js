import React from 'react'
import Header from 'components/Header'
import axios from 'axios'

class Home extends React.Component {
  componentDidMount() {
    console.log(123123)
    axios({
      url: 'http://3darar.com/api/v1/categories',
      method: 'GET'
    }).then(res => {
      console.log(res.data)
    })
  }
  render() {
    return (
      <div>
        <Header />
        this is HomePage
      </div>
    );
  }
}

export default Home
