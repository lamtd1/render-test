// Lấy dữ liệu từ cơ sở dữ liệu
// Tách riêng phần logic lấy từ DB vào module riêng
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url).then(
    result => console.log('connected')
).catch(err => {
    console.log('err connecting to DB: ', err.message)
})

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

phoneSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)