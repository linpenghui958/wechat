const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const WikiHouseSchema = new mongoose.Schema({
  name: String,
  cname: String,
  section: String,
  intro: String,
  wikiId: Number,
  words: String,
  sections: Mixed,
  swornMembers: [
    {
      character: {
        type: String,
        ref: 'WikiCharacter'
      },
      text: String
    }
  ],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

WikiHouseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

const WikiHouse = mongoose.model('WikiHouse', WikiHouseSchema)
