import { useState, useEffect } from 'react'
import axios from 'axios'
import List from './components/List'

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
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilterName(event.target.value)

  const addNote = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already in phonebook`)
    }else{
      const newPerson = { name: newName, number: newNumber}
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNumber('')
    }
  }
  
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
  
  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Add new number</h2>
      <PersonForm values={[newName,newNumber]} handlers={[handleNameChange,handleNumberChange,addNote]}/>
      <h2>Numbers</h2>
      <Filter value={filterName} handler={handleFilterChange}/>
      <List list={personsToShow}/>
    </div>
  )
}

export default App