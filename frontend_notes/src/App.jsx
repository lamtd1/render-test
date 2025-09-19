import { useState, useEffect } from "react"
import Note from "./components/Note"
import Notification from "./components/Notification"
import Footer from "./components/Footer"

import noteService from './services/notes'
// import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    noteService.getAll()
      .then(initalNotes => {
        setNotes(initalNotes)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    console.log(newNote)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
    .create(noteObject)
    .then(returnNote => {
      setNotes(notes.concat(returnNote))
      setNewNote('')
    })
  }

  const toggleImportanceOf = (id) => {
      const note = notes.find(note => note.id === id)
      const noteObj = {...note, important: !note.important}

      noteService
      .update(id, noteObj)
      .then(returnNote => {
        setNotes(notes.map(note => note.id === id ? returnNote : note))
      })
      // nếu có lỗi ở 1 note thì xoá nó khỏi notes luôn
      .catch(err => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
      
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
  console.log(notesToShow)

  return (
    <div>
      <h1>Notes</h1>
      {errorMessage === '' ? null : <Notification message={errorMessage}/>}
      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => {toggleImportanceOf(note.id)}}/>
        )}
      </ul>
      <form onSubmit={addNote}>

        <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button type="submit">save</button>
      </form>   
      <Footer />
    </div>
  )
}

export default App