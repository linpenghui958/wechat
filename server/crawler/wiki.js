import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { fetchImage } from  '../libs/qiniu'
import randomToken from 'random-token'
const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const getWikiId = async data => {
  const query = data.name || data.cname
  const url = `http://zh.asoiaf.wikia.com/api/v1/Search/List?query=${encodeURI(query)}`
  let res

  try {
    res = await rp(url)
  } catch (e) {
    console.log(e)
  }

  res = JSON.parse(res)
  res = res.items[0]

  console.log(res.id)
  return R.merge(data, res)
}

const getWikiDetail = async data => {
  const { id } = data
  const url = `http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id}`
  let res = []
  try {
    res = await rp(url)
  } catch (e) {
    console.log(e)
  }
  res = JSON.parse(res)

  const getCnameAndIntro = R.compose(
    i => ({
      cname: i.title,
      intro: R.map(R.prop(['text']))(i.content)
    }),
    R.pick(['title', 'content']),
    R.nth(0),
    R.filter(i => i.content.length),
    R.prop('sections')
  )

  const getLevel = R.compose(
    R.project(['title', 'content', 'level']),
    R.reject(R.propEq('title', '扩展阅读')),
    R.reject(R.propEq('title', '引用与注释')),
    R.filter(i => i.content.length),
    R.prop('sections')
  )
  let cnameAndIntro = getCnameAndIntro(res)
  let sections = getLevel(res)
  // let _res = R.merge(data, getCnameAndIntro(res))
  let _res = R.merge(data, cnameAndIntro)

  sections = normalizedSections(sections)
  // 保存相应字段
  _res.sections = sections
  _res.wikiId = id
  console.log(id + '-----detailTime ----- ' + detailTime++)
  return R.pick(['name', 'cname', 'playedBy', 'profile', 'images', 'nmId', 'chId', 'sections', 'intro', 'wikiId', 'words'], _res)
}

export const getWikiCharacters = async () => {
  let characterData = require(resolve(__dirname, '../../fullCharacters.json'))
  console.log(characterData.length)
  characterData = R.map(getWikiId, characterData)
  characterData = await Promise.all(characterData)

  characterData = R.map(getWikiDetail, characterData)
  characterData = await Promise.all(characterData)

  writeFileSync(resolve(__dirname, './json/chineseCharacters.json'), JSON.stringify(characterData, null, 2), 'utf8')
}

export const fetchImageFromIMDb = async () => {
  // 获取待遍历json数据
  let chineseCharactersData = require(resolve(__dirname, '../../chineseCharacters.json'))
  // 遍历数据
  chineseCharactersData = R.map(async (item) => {
    // 拿到profile(头像)字段
    let profile = item.profile
    // 拿到images(剧照)字段
    let images = item.images
    // 请求上传
    let key = `${item.nmId}/${randomToken(32)}`
    console.log('profile保存在qiniu的key为 -----' + key)
    await fetchImage(profile, key)
    // 保存字段
    item.profile = key
    // 遍历images
    for (let i = 0; i < item.images.length; ++i) {
      let _key = `${item.nmId}/${randomToken(32)}`
      console.log('images保存在qiniu的key为 -----' + _key)
      try {
        await fetchImage(item.images[i], _key)
      } catch (e) {
        item.images.splice(i, 1)
      }
      await sleep(100)
      // 保存字段
      item.images[i] = _key
    }
    return item
  })(chineseCharactersData)
  chineseCharactersData = await Promise.all(chineseCharactersData)
  console.log('开始写入文件')
  // 写入文件
  writeFileSync(resolve(__dirname, './json/qiniuCharacters.json'), JSON.stringify(chineseCharactersData, null, 2), 'utf8')
  console.log('保存文件完成')
}

const HOUSES = [
  {
    name: 'House Stark of Winterfell',
    cname: '史塔克家族',
    words: 'Winter is Coming'
  },
  {
    name: 'House Targaryen',
    cname: '坦格利安家族',
    words: 'Fire and Blood'
  },
  {
    name: 'House Lannister of Casterly Rock',
    cname: '兰尼斯特家族',
    words: 'Hear Me Roar!'
  },
  {
    name: 'House Arryn of the Eyrie',
    cname: '艾林家族',
    words: 'As High as Honor'
  },
  {
    name: 'House Tully of the Riverrun',
    cname: '徒利家族',
    words: 'Family, Duty, Honor'
  },
  {
    name: 'House Greyjoy of Pyke',
    cname: '葛雷乔伊家族',
    words: 'We Do Not Sow'
  },
  {
    name: "House Baratheon of Storm's End",
    cname: '风息堡的拜拉席恩家族',
    words: 'Ours is the Fury'
  },
  {
    name: 'House Tyrell of Highgarden',
    cname: '提利尔家族',
    words: 'Growing Strong'
  },
  {
    name: 'House Nymeros Martell of Sunspear',
    cname: '马泰尔家族',
    words: 'Unbowed, Unbent, Unbroken'
  }
]

export const getHouse = async () => {
  let data = R.map(getWikiId, HOUSES)

  data = await Promise.all(data)
  data = R.map(getWikiDetail, data)
  data = await Promise.all(data)

  writeFileSync(resolve('./json/wikiHouses.json'), JSON.stringify(data, null, 2), 'utf-8')
}

export const getSwornMembers = () => {
  // 拿到wikiHouse家族数据
  let wikiHouseData = require(resolve(__dirname, '../../wikiHouses.json'))
  // 拿到qiniuCharacters角色数据
  let qiniuCharacterData = require(resolve(__dirname, '../../qiniuCharacters.json'))
  // 遍历
  // 过滤数据
  let swornMembers = R.map(
    R.compose(
      i => _.reduce(i, (acc, item) => {
        acc = acc.concat(item)
        return acc
      }, []),
      R.map(i => {
        let item = R.find(R.propEq('cname', i[0]))(qiniuCharacterData) // 为了拿到nmId
        return {
          character: item.nmId,
          text: i[1]
        }
      }),
      R.filter(item => R.find(R.propEq('cname', item[0]))(qiniuCharacterData)),
      R.map(i => {
        let itemArray = i.split('，') // 中文逗号
        let name = itemArray.shift() //  拿到名字(未过滤)
        return [name.replace(/(【|】|爵士|一世女王|三世国王|公爵|国王|王后|夫人|公主|王子)/g, ''), 
          itemArray.join('，') // 若itemArray只有一个元素,分割符无效,单纯变为字符串
        ]
      }),
      R.nth(1),
      R.splitAt(1),
      R.prop('content'),
      R.nth(0),
      R.filter(i => R.test(/伊耿历三世纪末的/, i.title)),
      R.prop('sections')
    )
  )(wikiHouseData)
  // 保存字段
  wikiHouseData = _.map(wikiHouseData, (item, index) => {
    item.swornMembers = swornMembers[index]
    return item
  })
  // 保存文件
  console.log('保存文件开始')
  writeFileSync(resolve('./json/wikiHousesWithSwornMembers.json'), JSON.stringify(wikiHouseData, null, 2), 'utf8')
  console.log('保存文件完成')
}
