import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import { WikiHouseType } from './model'
import {
  getHouse,
  getHouseById
} from '../../api/wiki'

const house = {
  type: WikiHouseType,
  args: {
    id: {
      name: 'id', // 通过哪个参数拿到数据
      type: new GraphQLNonNull(GraphQLID) // 为非空的数据
    }
  },
  // graphql会自动处理Promise
  async resolve (root, params, options) {
    // 返回查询到的数据
    const data = await getHouseById(params.id)
    return data
  }
}

const houses = {
  type: new GraphQLList(WikiHouseType),
  args: {},
  async resolve (root, params, options) {
    const data = await getHouse()
    return data
  }
}

export default{
  house,
  houses
}
