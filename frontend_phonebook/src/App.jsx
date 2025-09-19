import { useState, useEffect } from 'react'
import personService from './services/phone' 
import Notification from './components/Notification'
import './index.css'
const Person = (props) =>{
  return (
    <>
      <p>{props.name} {props.number} <button onClick={props.onClick}>delete</button></p> 
    </>
  )
}

const Filter = ({filterName, handleFilterChange}) => {
  return (

      <form>
        filter shown with <input value={filterName} onChange={handleFilterChange} placeholder="Search name" />
      </form>
  )
}

const PersonForm = ({handleSubmit, newName, handleName, newNumber, handleNumber}) => {
    return (
      <>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value = {newName} onChange={handleName} />
        </div>
        <div>number: <input value = {newNumber} onChange={handleNumber} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      </>
    )
}

const Persons = ({personsToShow, handleDelete}) => {
  return (
    <>
      {personsToShow.map((person) => (
        <Person key={person.id} name={person.name} number={person.number} onClick={() => handleDelete({person})} />
      ))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMesasge] = useState(null)


  const handleName = (event) => {
    setNewName(event.target.value)

  }
  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nameExists = persons.filter(person => person.name === newName)
    
    if (nameExists.length !== 0 && confirm(`${nameExists[0].name} is already added to phonebook, replace old number with new one?`)) {
      const updatePerson = {
        name: nameExists[0].name,
        number: newNumber,
      }
      personService.update({id: nameExists[0].id, updatePerson}).then(
        updatePerson => {
          setPersons(
            persons.map(p => p.id === updatePerson.id ? updatePerson : p)
          )
        }
      ).catch(err => {
        setMesasge(`Information of ${nameExists[0].name} has been removed from server`)

      })

    } else {
      const personObj = {
        name: newName,
        number: newNumber,
      }
      personService.create(personObj).then(
        resp => setPersons(persons.concat(resp))
      )

      setMesasge(`Added ${newName}`)
      // setTimeout(() => {
      //   setMesasge(null)
      // }, 3000)
    }
    setNewName('')
    setNewNumber('')
  }
  useEffect(() => {
      personService.getAll().then(
        returnedPerson => setPersons(returnedPerson)
      )
  }, [])

  const handleDelete = ({person}) => {
      if( confirm(`Delete ${person.name}`)){
        personService.remove(person.id).then(id => {
          setPersons(persons.filter(p => p.id !== id))
        })
      }
  }

  const personsToShow = filterName ? persons.filter(person => 
    person.name.toLowerCase().includes(filterName.toLowerCase())
  ) : persons

  const handleFilterChange = (e) => {
    setFilterName(e.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message}/>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
      <h1>add a new</h1>
      <PersonForm newName={newName} newNumber={newNumber} handleSubmit={handleSubmit} handleNumber={handleNumber} handleName={handleName}/>
      <h1>Numbers</h1>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App
 
// import {useState, useEffect} from 'react'
// import axios from 'axios'

// const App = () => {
//   const [value, setValue] = useState('')
//   const [rates, setRates] = useState({})
//   const [currency, setCurrency] = useState(null)

//   useEffect(() => {
//     console.log('effect run, currency is now ', currency)

//     if (currency) {
//       console.log('fetching...')
//       axios
//       .get(`https://open.er-api.com/v6/latest/${currency}`)
//       .then(resp => {
//         setRates(resp.data.rates)
//       })
//     }
//   }, [currency])

//   const handleChange = (e) => setValue(e.target.value)

//   const onSearch = (e) => { e.preventDefault(); setCurrency(value) }

//   return (
//     <div>
//       <form onSubmit={onSearch}>
//       currency: <input value={value} onChange={handleChange}/>
//       <button type="submit">exchange rates</button>
//       </form>
//       <pre>
//         {JSON.stringify(rates, null, 2)}
//       </pre>
//     </div>
//   )
// }

// export default App

