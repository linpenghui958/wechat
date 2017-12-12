const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const ObjectId = Schema.Types.ObjectId
const PaymentSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  product: {
    type: ObjectId,
    tef: 'Product'
  },
  payType: String,
  totalFee: Number,
  name: String,
  phonNumber: String,
  address: String,
  description: String,
  order: Mixed,
  // 0 unfinished 1 finished
  success: {
    type: Number,
    default: 0
  },
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
PaymentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})
mongoose.model('Payment', PaymentSchema)
