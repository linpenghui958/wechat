import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

// 新建一个GraphQLObjectType实例（每一个type都是它的实例）
export let ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    _id: {
      type: GraphQLID // 唯一的ID
    },
    price: {
      type: GraphQLString  // 字符串
    },
    title: {
      type: GraphQLString
    },
    intro: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(GraphQLString) // 一个数组（每个值是字符串）
    }
  }
})
