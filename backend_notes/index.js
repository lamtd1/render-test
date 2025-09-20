require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}

app.use(express.static('dist'))
app.use(cors(corsOptions))
app.use(express.json())


app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if(note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  })
  .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id).then(
    result => {
      if(!result){
        return res.status(404).json({err : "note not exists"})
      } else {
        return res.status(204).end()
      }

    }
  ).catch(err => next(err))
})


app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
    const {content, important} = req.body

    Note.findById(req.params.id).then(note => {
      if(!note){
        return res.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then(updatedNote => res.json(updatedNote))
    }).catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(404).send({error: "malformatted id"})
  } else if(err.name === 'ValidationError') {
    return res.status(404).json({error: err.message})
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Run on ${PORT}`)
})
