const express = require('express')
const cors = require('cors')

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
app.get('/api/notes', (req, res) => {
  res.json(notes)
})
// get with id
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})
// delete
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const genId = () => String(Math.floor(Math.random() * 1000))
// post
app.post('/api/notes', (req, res) => {
  const note = req.body
  if (!note.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const newNote = {
    id: genId(),
    content: note.content,
    important: false || note.important
  }

  notes = notes.concat(newNote)
  res.status(201).json(newNote)
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
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Run on ${PORT}`)
})
