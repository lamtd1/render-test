require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/phone')
const app = express()

const json_parse = express.json()

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path:   ', req.path)
    console.log('Body:   ', req.body)
    console.log('----');
    next()

}

morgan.token('body', function (req, res) {
    if(req.method === 'POST')
        return JSON.stringify(req.body)
    return ' '
})

app.use(json_parse)
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

const now = new Date()

app.get('/api/persons', (req, res) => {
    Phone.find({}).then(phones => res.json(phones))
})

app.get('/info', (req, res, next) => {
    Phone.countDocuments({}).then(
      count => res.send(`<p>Phone book has info for ${count} people</p><p>${now}</p>`
    )
    )

})

app.get('/api/persons/:id', (req, res, next) => {
    Phone.findById(req.params.id).then(
      person => res.json(person)
    ).catch(
      err => next(err)
    )
} )

app.delete('/api/persons/:id', (req, res, next) => {
  Phone.findByIdAndDelete(req.params.id).then(
    person => {
      if(!person) {
        return res.status(404).json({err: 'person not exist'})
      } else {
        return res.status(204).end()
      }
    }
  ).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const {name, number} = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'content missing' })
  }
  const newPerson = new Phone({
    name: name,
    number: number
  })

  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(
    err => next(err)
  )
})

app.put('/api/persons/:id', (req, res, next)=> {
  const {name, number} = req.body
  Phone.findById(req.params.id).then(
    person => {
      if(!person) {
        return res.status(404).json({err: "Person not exists"})
      } else {
        person.name = name
        person.number = number
        person.save().then(savedPerson => res.json(savedPerson))
      }
    }
  ).catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`running on ${PORT}`)
})