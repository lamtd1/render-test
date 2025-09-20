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

let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
]


// get all
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// get with id
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then(note => {
    res.json(note)
  })
})

// delete
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
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

    const exists = notes.some(n => n.id === id);
    if (!exists) {
    return res.status(404).json({ err: 'note not found' });
    }

    if (!note.content) {
        return res.status(400).json({err: 'content missing'})
    }

    const updateNote = {
        id: id,
        content: note.content,
        important: note.important ?? false
    }

    notes = notes.map(note => note.id === id ? updateNote : note)
    res.status(200).json(updateNote)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Run on ${PORT}`)
})
