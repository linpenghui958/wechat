import Services from './services'

export default {
  getWechatSignature ({commit}, url) {
    return Services.getWechatSignature(url)
  },
  getUserByOAuth ({commit}, url) {
    return Services.getUserByOAuth(url)
  },
  async fetchHouses ({ state }) {
    const res = await Services.fetchHouses()
    state.houses = res.data[0].data
    return res
  },
  async fetchCharacters ({ state }) {
    const res = await Services.fetchCharacters()
    state.characters = res.data[0].data
    return res
  },
  async fetchCities ({ state }) {
    const res = await Services.fetchCities()
    state.cities = res.data[0].data
    return res
  }
}
