import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const createStore = () => {
  return new Vuex.Store({
    state: {
      imageCDN: 'http://p09h7s4y2.bkt.clouddn.com/',
      currentHouse: {},
      currentCharacter: {},
      products: [],
      currentProduct: {},
      houses: [],
      user: null,
      characters: []
    },
    getters,
    actions,
    mutations
  })
}

export default createStore
