import axios from 'axios'
import debug from 'debug'
import {param} from './url'
import config from 'config'

const log = debug('FETCH')

const defaults = {
  method: 'GET',
  dataType: 'json'
}

const isOk = res => res.status >= 200 && res.status < 300

const sendRequest = ({finalOptions, url, finalHeaders, data}) => {
  return new Promise((resolve, reject) => {
    log(url)
    axios({
      ...finalOptions,
      url: config.apiBaseURL + url,
      headers: finalHeaders,
      data,
    }).then(res => {
      if(isOk(res)) {
        return resolve(res.data)
      } else {
        return reject(res)
      }
    }).catch(err => {
      return reject(err)
    })
  })
}
  
/*** 
 * https://github.com/axios/axios/blob/master/lib/adapters/xhr.js#L117  
 * 当 data 为空时，axios 会删掉 ‘Content-Type’， 所以默认给个空对象作为 data
 * ***/
const formalizeData = options =>
  options.json ? JSON.stringify(options.json) : (options.data || {})

const getHeaders = options => {
  const finalHeaders = {
    ...options.headers,
  }
  if (options.contentType) {
    finalHeaders['Content-Type'] = options.contentType
  } else if (options.json) {
    finalHeaders['Content-Type'] = 'application/json; charset=utf-8'
  } else {
    finalHeaders['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  return finalHeaders
}

const fetch = (url, options = {}) => {
  if (typeof options.query === 'object') {
    url += (url.indexOf('?') === -1 ? '?' : '') + param(options.query)
    delete options.query
  }
  const data = formalizeData(options)
  const finalHeaders = getHeaders(options)
  const finalOptions = Object.assign({}, defaults, options)

  return sendRequest({
    finalOptions,
    url,
    finalHeaders,
    data,
  })
}

export default fetch
