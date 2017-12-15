import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
const sleep = time => new Promise(resolve => setTimeout(resolve, time))
export const getIMDbCharacter = async () => {
  console.log('开始执行')
  // imdb 上权游的卡司的页面地址 http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    transform: body => cheerio.load(body)
  }

  var $ = await rp(options)
  var photos = []

  console.log('开始爬取')
  // 拿到所有的 playedBy, nmId, name, chId
  $('table.cast_list tr.odd, tr.even').each(function () {
    let playedBy = $(this).find('td.itemprop span.itemprop')
    playedBy = playedBy.text()

    let nmId = $(this).find('td.itemprop a')
    nmId = nmId.attr('href')

    let character = $(this).find('td.character a')
    let replaceName = $(this).find('a.toggle-episodes').text()
    let name = character.text().replace(replaceName, '')
    let chId = character.attr('href')
    if (nmId && playedBy && name && chId) {
      const data = {
        playedBy,
        nmId,
        name,
        chId
      }
      photos.push(data)
    }
  })
  console.log('共拿到' + photos.length + '数据')
  writeFileSync(resolve(__dirname, '../../json/imdb1.json'), JSON.stringify(photos, null, 2), 'utf8')
  const fn = R.compose(
    R.map(photo => {
      const reg1 = /\/name\/(.*?)\/\?ref/

      const match1 = photo.nmId.match(reg1)

      photo.nmId = match1[1]

      return photo
    }),
    R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
  )

  photos = fn(photos)
  console.log('过滤后还剩' + photos.length + '数据')
  writeFileSync(resolve(__dirname, '../../json/imdb.json'), JSON.stringify(photos, null, 2), 'utf8')
  // return photos
}

const fetchIMDbProfile = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }
  const $ = await rp(options)
  const img = $('a#name-poster')
  let src = img.attr('src')

  if (src) {
    src = src.split('_V1').shift()
    src += '_V1.jpg'
  }
}

export const getIMDbProfile = async () => {
  const characters = require(resolve(__dirname, '../../json/imdb.json'))
  console.log(characters.length)
  for (let i = 0; i < characters.length; i++) {
    if (!characters.profile) {
      const url = `http://www.imdb.com/name/${characters[i].nmId}/`
      console.log('正在爬取' + characters[i].name)
      const src = await fetchIMDbProfile(url)
      characters[i].profile = src
      writeFileSync(resolve(__dirname, './json/imdbCharacters.json'), JSON.stringify(characters, null, 2), 'utf8')
      await sleep(500)
    }
  }
}

const fetchIMDBImage = async (url) => {
  // 构建请求参数
  const options = {
    uri: url,
    transform: (body) => cheerio.load(body)
  }
  // console.log('------正在爬虫------fetchIMDBProfile------')
  // 构建DOM查询对象
  const $ = await rp(options)
  let imagesDOM = $('a.titlecharacters-image-grid__thumbnail-link img')
  let images = []
  imagesDOM.each(function () {
    let imageUrl = $(this).attr('src')
    // 获取src
    // https://images-na.ssl-images-amazon.com/images/M/MV5BODI3ODA5NTQ5OF5BMl5BanBnXkFtZTgwODkzODMzMzI@._V1_.jpg
    // 截取imageUrl 保证原图尺寸
    if (imageUrl) {
      imageUrl = imageUrl.split('_V1').shift()
      imageUrl += '_V1.jpg'
    }
    // console.log(imageUrl)
    images.push(imageUrl)
  })
  return images
}

export const getIMDbImages = async () => {
  const characters = require(resolve(__dirname, '../../validCharacters.json'))
  console.log(characters.length)

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].images) {
      const url = `http://www.imdb.com/character/${characters[i].chId}`
      const images = await fetchIMDBImage(url)
      characters[i].images = images

      writeFileSync(resolve('./json/fullCharacters.json'), JSON.stringify(characters, null, 2), 'utf-8')

      await sleep(500)
    }
  }
}
