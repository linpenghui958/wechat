import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'

// 新建一个GraphQLObjectType实例（每一个type都是它的实例）
export let WikiCharacterType = new GraphQLObjectType({
  name: 'WikiCharacter',
  fields: {
    _id: {
      type: GraphQLID // 唯一的ID
    },
    name: {
      type: GraphQLString
    },
    cname: {
      type: GraphQLString
    },
    playedBy: {
      type: GraphQLString
    },
    profile: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(GraphQLString) // 一个数组（每个值是字符串）
    },
    nmId: {
      type: GraphQLString
    },
    chId: {
      type: GraphQLString
    },
    sections: {
      type: new GraphQLList(GraphQLString) // 一个数组（每个值是字符串）
    },
    intro: {
      type: GraphQLString
    },
    wikiId: {
      type: GraphQLInt
    }
  }
})
