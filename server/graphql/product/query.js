import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import mongoose from 'mongoose'
import { ProductType } from './model'
const Product = mongoose.model('Product')

const product = {
  type: ProductType,
  args: {
    id: {
      name: 'id', // 通过哪个参数拿到数据
      type: new GraphQLNonNull(GraphQLID) // 为非空的数据
    }
  },
  // graphql会自动处理Promise
  resolve (root, params, options) {
    // 返回查询到的数据
    return Product.findOne({
      _id: params.id
    }).exec()
  }
}

const products = {
  type: new GraphQLList(ProductType),
  args: {},
  resolve (root, params, options) {
    return Product.find({}).exec()
  }
}

export default{
  product,
  products
}
