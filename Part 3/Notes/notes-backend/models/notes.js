const mongoose = require('mongoose')

// Tutaj wstawiasz swój string połączenia (ten z MongoDB Atlas)
const url = process.env.MONGODB_URI 

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Definicja schematu
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Konwersja na format, który przyda się później (usuwa _id i __v)
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Eksportujemy model
module.exports = mongoose.model('Note', noteSchema)