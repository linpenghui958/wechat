import mongoose from 'mongoose'
const Payment = mongoose.model('Payment')

export async function fetchPayments () {
  const data = await Payment.find({}).populate('product user').exec()
  return data
}
