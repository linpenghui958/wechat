import axios from 'axios'

const baseUrl = ''

class Services {
  getWechatSignature (url) {
    // 对同域下得signature发请求，然后被router截获
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }

  getUserByOAuth (url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }

  async fetchHouses () {
    try {
      return axios.get(`${baseUrl}/wiki/houses`)
    } catch (e) {
      console.log(e)
    }
    // return {data: {data: []}, success: true}
  }
  async fetchHouse (id) {
    return axios.get(`${baseUrl}/wiki/houses/${id}`)
  }
  async fetchCharacters () {
    return axios.get(`${baseUrl}/wiki/characters`)
    // return {data: {data: []}, success: true}
  }
  async fetchCharacter (id) {
    return axios.get(`${baseUrl}/wiki/characters/${id}`)
  }
  async fetchProducts () {
    return axios.get(`${baseUrl}/wiki/products`)
  }
  async fetchProduct (id) {
    return axios.get(`${baseUrl}/wiki/products/${id}`)
  }
  async fetchUserAndOrders (id) {
    return axios.get(`${baseUrl}/api/user`)
  }
}

export default new Services()
