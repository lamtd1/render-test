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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// const genId = () => {
//     return String(Math.floor(Math.random() * 10000))
// }


const now = new Date()

app.get('/api/persons', (req, res) => {
    Phone.find({}).then(phones => res.json(phones))
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phone book has info for ${persons.length} people</p><p>${now}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Phone.findById(id).then(
        phone => res.json(phone)
    )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
      Phone.findByIdAndDelete(id).then(
        deletedPhone => {
          if (!deletedPhone) {
            return res.status(404).json({error: "note not found"})
          }
          res.status(204).end()
        }
      )
    })

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number){
        return res.status(400).json({"err": 'missing name or body'})
    }

    Phone.findOne({name: body.name}).then(existing => {
        if(existing){
            return res.status(400).json({ err: 'name must be unique' })
        }

        const newPerson = new Phone({
            name: body.name,
            number: body.number
        })

        newPerson.save().then(savedPerson => res.json(savedPerson))
    })



})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`running on ${PORT}`)
})