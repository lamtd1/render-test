// Lấy dữ liệu từ cơ sở dữ liệu
// Tách riêng phần logic lấy từ DB vào module riêng
const mongoose = require('mongoose')
// Giữ tính chất cữ
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
// kết nối mongoose
mongoose.connect(url).then(
    result => console.log('connected')
).catch(err => {
    console.log('err connecting to DB: ', err.message)
})
// định nghĩa schema
const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})
// chỉnh lại json trả về 
phoneSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)