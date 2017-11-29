import * as _ from 'lodash'
import { writeFileSync } from 'fs'
import request from 'request-promise'

var characters = []

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const getAllCharacters = async (page = 1) => {
  var res = await request(`https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=50`)
  var body = JSON.parse(res)

  console.log('正在爬第' + page + '页数据')

  characters = _.union(characters, body)
  if (body.length < 50) {
    console.log('爬完了')
    return
  } else {
    writeFileSync('./characters.json', JSON.stringify(characters), 'utf8')
    await sleep(1000)
    page++
    getAllCharacters(page)
  }
}
getAllCharacters()
