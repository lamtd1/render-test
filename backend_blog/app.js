const express = require('express')
const mongoose = require('mongoose')
const {info, error } = require('./utils/logger') 
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blog')
const cors = require('cors')

const app = express()

info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(res => {
    info('connected to MONGODB')
}).catch(err => error('error connect to MONGO ', err.message))

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app



