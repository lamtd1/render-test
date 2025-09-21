const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

notesRouter.get('/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if(note){
            res.json(note)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})

notesRouter.post('/', (req, res, next) => {
    const newNote = Note({
        content: req.body.content,
        important: req.body.important || false
    })
    newNote.save().then(savedNote => {
        res.json(savedNote)
    }).catch(err => next(err))
})

notesRouter.delete('/:id', (req, res ,next) => {
    Note.findByIdAndDelete(req.params.id).then(
        deleteNote => {
            res.status(204).end()
        }
    ).catch(err => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
    const {content, important} = req.body
    Note.findById(req.params.id).then(
        note => {
            if(!note) res.status(404).end()
            note.important = important
            note.content = content
            return note.save().then(updatedNote => res.json(updatedNote))
        }
    ).catch(err => next(err))
})


module.exports = notesRouter