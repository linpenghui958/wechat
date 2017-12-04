import { resolve } from 'path'
import R from 'ramda'
import { find } from 'lodash'
import { writeFileSync } from 'fs'
//  拿到character数据(from api)
const charactersData = require(resolve(__dirname, '../../characters.json'))
//  拿到imdb数据 (from imdb)
const imdbData = require(resolve(__dirname, '../../imdb.json'))

console.log(charactersData.length) // 2100
console.log(imdbData.length) // 720

const findNameInAPI = (item) => {
  // 以charactersData作基准,做比较
  return find(charactersData, {
    name: item.name
  })
}
const findPlayedByInAPI = (item) => {
  // 以charactersData作基准,做比较
  return find(charactersData, i => {
    return i.playedBy.includes(item.playedBy)
  })
}
let vaildData = R.filter(
  i => findNameInAPI(i) && findPlayedByInAPI(i)
)
const filterData = vaildData(imdbData)
console.log(filterData.length)

writeFileSync('./wikiCharacters.json', JSON.stringify(filterData, null, 2), 'utf8')
