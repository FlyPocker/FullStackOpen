import { useState } from 'react'
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
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