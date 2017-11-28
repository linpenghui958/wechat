import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rap.taobao.org/mockjsdata/21639'

class Services {
  getWechatSignature (url) {
    // 对同域下得signature发请求，然后被router截获
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }

  getUserByOAuth (url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }

  async fetchHouses () {
    return axios.get(`${apiUrl}/wiki/houses`)
  }
  async fetchHouse (id) {
    return axios.get(`${apiUrl}/wiki/houses/${id}`)
  }
  async fetchCities () {
    return axios.get(`${apiUrl}/wiki/cities`)
  }
  async fetchCharacters () {
    return axios.get(`${apiUrl}/wiki/characters`)
  }
  async fetchCharacter (id) {
    return axios.get(`${apiUrl}/wiki/characters/${id}`)
  }
  async fetchProducts () {
    return axios.get(`${apiUrl}/wiki/products`)
  }
  async fetchProduct (id) {
    return axios.get(`${apiUrl}/wiki/products/${id}`)
  }
  async fetchUserAndOrders (id) {
    return axios.get(`${apiUrl}/api/user`)
  }
}

export default new Services()
