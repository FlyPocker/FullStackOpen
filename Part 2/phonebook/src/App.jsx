import { useState, useEffect } from 'react'
import axios from 'axios'
import List from './components/List'
import personServise from './services/persons'

const PersonForm = ({ values, handlers }) => (
  <form>
      <div>name: <input value={values[0]} onChange={handlers[0]}/></div>
      <div>number: <input value={values[1]} onChange={handlers[1]}/></div>
      <div>
        <button onClick={handlers[2]} type="submit">add</button>
      </div>
  </form>
)

const Filter = ({ value, handler }) => (
  <div>
    filter numbers: <input value={value} onChange={handler}/>
  </div>
)

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    console.log('effect')
    personServise.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilterName(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already in phonebook`)
      const person = persons.find(person => person.name === newName)
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)){
        const newPerson = { name: person.name, number: newNumber}
        personServise.update(person.id, newPerson)
          .then(response => {
            setPersons(persons.map(person => person.id === response.data.id ? response.data : person))
            setNewName('')
            setNewNumber('')
          })
      }
    }else{
      const newPerson = { name: newName, number: newNumber}
      personServise.create(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (id) => {
    console.log('delete the number: ', id)
    if (window.confirm(`Are you sure to delete this note?`)) {
      
      personServise
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          alert(`number was already deleted`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }
  
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
  
  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Add new number</h2>
      <PersonForm values={[newName,newNumber]} handlers={[handleNameChange,handleNumberChange,addPerson]}/>
      <h2>Numbers</h2>
      <Filter value={filterName} handler={handleFilterChange}/>
      <List list={personsToShow} btnHandler={deletePerson}/>
    </div>
  )
}

export default App