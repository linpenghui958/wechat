import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import ProductQueries from './product/query'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    // 引入对应的子模型，使GraphQL有对应查询的能力
    fields: Object.assign(
      ProductQueries
    )
  })
})
