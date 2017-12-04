import qiniu from 'qiniu'
import config from '../config'
import { exec } from 'shelljs'
// 七牛密钥
qiniu.conf.ACCESS_KEY = config.qiniu_accessKey
qiniu.conf.SECRET_KEY = config.qiniu_secretKey

const bucket = 'fire'
// 上传空间命
export const fetchImage = async (url, key) => {
  // const client = new qiniu.rs.Client()

  return new Promise((resolve, reject) => {
    // client.fetch(url, bucket, key, (err, ret) => {
    //   if (err) reject(err)
    //   else resolve(ret)
    // })
    const bash = `qshell fetch ${url} ${bucket} ${key}`
    // 上传脚本
    const child = exec(bash, {async: true})
    child.stdout.on('data', data => {
      console.log(data)
      resolve(data)
    })
  })
}
