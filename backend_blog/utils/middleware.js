// Đọc method, path
const {info, error} = require('./logger')
const requestLogger = (req, res, next) => {
    info('METHOD', req.method)
    info('PATH', req.path)
    info('BODY', req.body)
    info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.json({Error: "Unknow endpoint"})
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}