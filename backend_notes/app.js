const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middlerware = require('./utils/middleware')
const notesRouter = require('./controllers/note')
const cors = require('cors')

const app = express()
const {info, error} = logger
const {MONGODB_URI, PORT} = config
info('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
.then(() => {
    info('connected to MONGODB')
}).catch(err => error('error connected to MONGODB: ', error.message))

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.static('dist'))
app.use(express.json())
app.use(middlerware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middlerware.unknownEndpoint)
app.use(middlerware.errorHandler)

module.exports = app
