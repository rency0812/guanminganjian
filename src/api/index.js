import axios from 'src/interceptor'
import config from 'src/config'
import store from 'src/store'

export default {
  request (method, uri, data = null) {
    if (!method) {
      console.error('API function call requires method argument')
      return
    }

    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    const url = config.serverURI + uri
    const headers = {'X-Requested-With': 'XMLHttpRequest'}
    return axios({ method, url, data, headers })
  },

  GET (uri, data = null) {
    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    const url = config.serverURI + uri
    const headers = {'X-Requested-With': 'XMLHttpRequest'}
    return axios({
      url: url,
      method: 'get',
      params: {
        ...data
      },
      headers: headers
    })
  },

  POST (uri, data = null) {
    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    const headers = {'X-Requested-With': 'XMLHttpRequest'}
    const URL = config.serverURI + uri
    const token = store.state.token ? store.state.token : ''
    const payload = {
      token: token,
      ...data
    }
    return axios.post(URL, payload, headers)
  }
}
