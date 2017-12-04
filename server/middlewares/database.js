import fs from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import config from '../config'
import R from 'ramda'
const models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)))

const wikiHouseData = require(resolve(__dirname, '../../wikiHousesWithSwornMembers.json'))
let wikiCharacterData = require(resolve(__dirname, '../../qiniuCharacters.json'))

// 保证_id与nmId一致
wikiCharacterData = R.map(i => {
  i._id = i.nmId
  return i
})(wikiCharacterData)
export const database = app => {
  mongoose.set('debug', true)

  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.on('open', async () => {
    console.log('Connected to MongoDB', config.db)

    // 引入对应的model
    const wikiHouseModel = mongoose.model('WikiHouse')
    const wikiCharacterModel = mongoose.model('WikiCharacter')
    // 查询数据库中是否存在tables
    const isExistWikiHouse = await wikiHouseModel.find({}).exec()
    const isExistWikiCharacterModel = await wikiCharacterModel.find({}).exec()
    // 如果不存在，插入数据
    if (!isExistWikiHouse.length) {
      wikiHouseModel.insertMany(wikiHouseData)
    } else {
      console.log('wikiHouseModel 已存在数据')
    }
    if (!isExistWikiCharacterModel.length) {
      wikiCharacterModel.insertMany(wikiCharacterData)
    } else {
      console.log('wikiCharacterModel 已存在数据')
    }
  })
}
