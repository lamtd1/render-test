require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
// Tải file dist của React và dùng chung server
app.use(express.static('dist'))


// get all
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// get with id
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then(note => {
    if(note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  })
  .catch(err => {
    console.log(err)
    res.status(400).send({ error: 'malformatted id' })
  })
})

// delete
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  Note.findByIdAndDelete(id).then(
    deletedNote => {
      if (!deletedNote) {
        return res.status(404).json({error: "note not found"})
      }
      res.status(204).end()
    }
  )
})

const genId = () => String(Math.floor(Math.random() * 1000))

// post
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

// put
app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = req.body

    const exists = Note.findById(id)

    if (!note.content) {
        return res.status(400).json({err: 'content missing'})
    }

    const updateNote = {
        content: note.content,
        important: note.important ?? false
    }

    Note.findByIdAndUpdate(id, updateNote, {new: true, runValidators: true}).then(
      updatedNote => {
        if(!updatedNote) {
          return res.status(404).json({ err: 'note not found' })
        }
        res.status(200).json(updatedNote)
      }
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Run on ${PORT}`)
})
