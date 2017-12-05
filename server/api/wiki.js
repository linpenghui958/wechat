import Router from 'koa-router'
import config from '../config/index'
import mongoose from 'mongoose'

const WikiHouse = mongoose.model('WikiHouse')
const WikiCharacter = mongoose.model('WikiCharacter')

export async function getHouse () {
  const data = await WikiHouse
    .find({})
    .populate({
      path: 'swornMembers.character',
      select: '_id name cname profile'
    })
    .exec()

  return data
}

export async function getHouseById (_id) {

  const data = await WikiHouse
    .findOne({
      _id: _id
    })
    .populate({
      path: 'swornMembers.character',
      select: '_id name profile cname nmId'
    })
    .exec()

  return data
}

export async function getCharacters (limit = 20) {
  const data = await WikiCharacter
    .find({})
    .limit(Number(limit))
    .exec()

  return data
}

export async function getCharacter (_id) {

  const data = await WikiCharacter
    .findOne({_id: _id})
    .exec()

  return data
}
