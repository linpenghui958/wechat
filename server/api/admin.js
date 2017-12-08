import mongoose from 'mongoose'
const User = mongoose.model('User')
export async function login (email, password) {
  let match = false

  let user = await User.findOne({email: email}).exec()

  if (user) {
    match = await User.comparePassword(password, user.password)
  }
 
  return {match, user}
}
