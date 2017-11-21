import request from 'request-promise'
import formstream from 'formstream'
import fs from 'fs'
import path from 'path'
import * as _ from 'lodash'
const base = 'https://api.weixin.qq.com/cgi-bin/'

const api = {
  access_token: base + 'token?grant_type=client_credential',
  temporary: {
    upload: base + 'media/upload?',
    fetch: base + 'media/get?'
  },
  permanent: {
    upload: base + 'material/add_material?',
    uploadNews: base + 'material/add_news?',
    uploadNewsPic: base + 'media/uploadimg?',
    fetch: base + 'material/get_material?',
    del: base + 'material/del_material?',
    update: base + 'material/update_news?',
    count: base + 'material/get_materialcount?',
    batch: base + 'material/batchget_material?'
  },
  tag: {
    create: base + 'tags/create?',
    fetch: base + 'tags/get?',
    update: base + 'tags/update?',
    del: base + 'tags/delete?',
    fetchUsers: base + 'user/tag/get?',
    batchTag: base + 'tags/members/batchtagging?',
    batchUnTag: base + 'tags/members/batchuntagging?',
    getTagList: base + 'tags/getidlist?'
  },
  user: {
    remark: base + 'user/info/updateremark?',
    info: base + 'user/info?',
    batchInfo: base + 'user/info/batchget?',
    fetchUserList: base + 'user/get?',
    getBlackList: base + 'tags/members/getblacklist?',
    batchBlackUsers: base + 'tags/members/batchblacklist?',
    batchUnblackUsers: base + 'tags/members/batchunblacklist?'
  },
  menu: {
    create: base + 'menu/create?',
    get: base + 'menu/get?',
    del: base + 'menu/delete?',
    addCondition: base + 'menu/addconditional?',
    delCondition: base + 'menu/delconditional?',
    getInfo: base + 'get_current_selfmenu_info?'
  },
  ticket: {
    get: base + 'ticket/getticket?'
  }
}

function statFile (filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stat) => {
      if (err) reject(err)
      else resolve(stat)
    })
  })
}

export default class Wechat {
  constructor (opts) {
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.fetchAccessToken()
  }

  async request (options) {
    options = Object.assign({}, options, {json: true})
    try {
      const response = await request(options)
      console.log(response)
      return response
    } catch (err) {
      console.error(err)
    }
  }

  async fetchAccessToken () {
    let data = await this.getAccessToken()

    if (!this.isValidAccessToken(data)) {
      data = await this.updateAccessToken()
    }
    await this.saveAccessToken(data)
    return data
  }

  async updateAccessToken () {
    const url = api.access_token + `&appid=${this.appID}&secret=${this.appSecret}`
    const data = await this.request({url: url})
    const now = (new Date().getTime())
    const expires_in = now + (data.expires_in - 20) * 1000
    data.expires_in = expires_in
    return data
  }

  isValidAccessToken (data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false
    }
    const expires_in = data.expires_in
    const now = (new Date().getTime())
    if (now < expires_in) {
      return true
    } else {
      return false
    }
  }

  async handle (operation, ...args) {
    const tokenData = await this.fetchAccessToken()
    const options = this[operation](tokenData.access_token, ...args)
    const data = await this.request(options)
    return data
  }

  uploadMaterial (token, type, material, permanent) {
    let form = {}
    let url = api.temporary.upload

    if (permanent) {
      url = api.permanent.upload
      _.extend(form, permanent)
    }
    if (type === 'pic') {
      url = api.temporary.uploadNewsPic
    }
    if (type === 'news') {
      url = api.permanent.uploadNews
      form = material
    } else {
      form.media = fs.createReadStream(material)
    }

    let uploadUrl = url + 'access_token=' + token

    if (!permanent) {
      uploadUrl += '&type=' + type
    } else {
      if (type !== 'news') {
        form.access_token = token
      }
    }
    const options = {
      method: 'POST',
      url: uploadUrl,
      json: true
    }
    if (type === 'news') {
      options.body = form
    } else {
      options.formData = form
    }
    console.log(options)
    return options
  }

  fetchMaterial (token, mediaId, type, permanent) {
    let form = {}
    let fetchUrl = api.temporary.fetch

    if (permanent) {
      fetchUrl = api.permanent.fetch
    }

    let url = fetchUrl + 'access_token=' + token
    let options = {method: 'POST', url: url}

    if (permanent) {
      form.media_id = mediaId
      form.access_token = token
      options.body = form
    } else {
      if (type === 'video') {
        url = url.replace('https://', 'http://')
      }

      url += '&media_id=' + mediaId
    }

    return options
  }

  deleteMaterial (token, mediaId) {
    const form = {
      media_id: mediaId
    }
    const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId

    return {method: 'POST', url: url, body: form}
  }

  updateMaterial (token, mediaId, news) {
    const form = {
      media_id: mediaId
    }

    _.extend(form, news)
    const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

    return {method: 'POST', url: url, body: form}
  }

  countMaterial (token) {
    const url = api.permanent.count + 'access_token=' + token

    return {method: 'POST', url: url}
  }

  batchMaterial (token, options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 10

    const url = api.permanent.batch + 'access_token=' + token

    return {method: 'POST', url: url, body: options}
  }
}
