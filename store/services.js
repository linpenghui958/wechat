import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rap.taobao.org/mockjsdata/24957'

class Services {
  getWechatSignature (url) {
    // 对同域下得signature发请求，然后被router截获
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }

  getUserByOAuth (url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }

  fetchHouses (url) {
    return axios.get(`${apiUrl}/wiki/houses`)
  }
  fetchCities (url) {
    return axios.get(`${apiUrl}/wiki/cities`)
  }
  fetchCharacters (url) {
    return axios.get(`${apiUrl}/wiki/characters`)
  }
}

export default new Services()
