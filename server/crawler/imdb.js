import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'

export const getIMDbCharacter = async () => {
  console.log('开始执行')
  // imdb 上权游的卡司的页面地址 http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    transform: body => cheerio.load(body)
  }

  var $ = await rp(options)
  var photos = []

  console.log('开始趴取')
  // 拿到所有的 playedBy, nmId, name, chId
  $('table.cast_list tr.odd, tr.even').each(function () {
    let playedBy = $(this).find('td.itemprop span.itemprop')
    playedBy = playedBy.text()

    let nmId = $(this).find('td.itemprop a')
    nmId = nmId.attr('href')

    let character = $(this).find('td.character a')

    let name = character.text()
    let chId = character.attr('href')

    const data = {
      playedBy,
      nmId,
      name,
      chId
    }

    photos.push(data)
  })
  console.log('共拿到' + photos.length + '数据')
  writeFileSync('./imdb1.json', JSON.stringify(photos, null, 2), 'utf8')
  // const fn = R.compose(
  //   R.map(photo => {
  //     const reg1 = /\/name\/(.*?)\/\?ref/
  //     const reg2 = /\/character\/(.*?)\/\?ref/

  //     const match1 = photo.nmId.match(reg1)
  //     const match2 = photo.chId.match(reg2)

  //     photo.nmId = match1[1]
  //     photo.chId = match2[1]

  //     return photo
  //   }),
  //   R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
  // )
  var filterArray = function (array) {
    let newArray = []
    array = JSON.stringify(array)
    array.foreach((item) => {
      if (item.playedBy && item.name && item.nmId && item.chId) {
        newArray.push(item)
      }
    })
    return newArray
  }

  photos = filterArray(photos)
  console.log('过滤后还剩' + photos.length + '数据')
  writeFileSync('./imdb.json', JSON.stringify(photos, null, 2), 'utf8')
  // return photos
}

getIMDbCharacter()
