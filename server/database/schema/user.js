const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10 // 加盐权重
const MAX_LOGIN_ATTEMPTS = 5 // 最多尝试次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 禁止登陆时间
// 定义userScheme所需的字段
const UserSchema = new mongoose.Schema({
  // user admin
  role: {
    type: String,
    default: 'user'
  },
  openid: String,
  unionid: String,
  nickname: String,
  address: String,
  province: String,
  country: String,
  city: String,
  headimgUrl: String,
  gender: String,
  email: String,
  password: String,
  hashed_password: String,
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUtil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
// 虚拟字段，返回当前账号是否被锁
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUtil && this.lockUtil > Date.now())
})
// 存储前更新储存时间
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.mete.updatedAt = Date.now()
  }
  next()
})

UserSchema.pre('save', function (next) {
  var user = this
  // 如果没有修改密码直接next
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    // 如若修改密码，则将密码加盐，然后赋值给user的password
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)

      user.password = hash
      next()
    })
  })
})

// 给UserSchema添加方法
UserSchema.methods = {
  // 比较密码的方法
  comparePassword: function (_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  // 登陆尝试和loginAttempts
  incLoginAttempts: function (user) {
    const that = this
    return new Promise((resolve, reject) => {
      // 如果没有被锁，设置loginAttempts初始值
      if (this.lockUtil && this.lockUtil < Date.now()) {
        that.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUtil: 1
          }
        }, function (err) {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        // 否则给loginAttempts自加1
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }
        // 如果超出尝试次数，则进行锁止
        if (that.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !that.isLocked) {
          updates.$set = {
            lockUtil: Date.now() + LOCK_TIME
          }
        }
        that.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}
const User = mongoose.model('User', UserSchema)
