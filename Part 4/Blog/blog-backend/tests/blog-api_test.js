const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('addition of a new blog', () => {

  // Przed każdym testem czyścimy bazę i tworzymy jednego świeżego użytkownika
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ 
      username: 'root', 
      name: 'Superuser', 
      passwordHash 
    })
    await user.save()
  })

  test('succeeds with valid data and correctly assigns a user', async () => {
    // 1. Wyciągamy stworzonego przed chwilą użytkownika z bazy
    const usersInDb = await User.find({})
    const user = usersInDb[0]

    // 2. Tworzymy paczkę z danymi bloga i doklejamy poprawne userId
    const newBlog = {
      title: 'Mój pierwszy testowy blog',
      author: 'Michał',
      url: 'https://fullstackopen.com',
      likes: 10,
      userId: user.id
    }

    // 3. Wysyłamy żądanie POST do naszego API
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // 4. Pobieramy wszystkie blogi z bazy, żeby sprawdzić, czy zapis się udał
    const blogsAtEnd = await Blog.find({})
    
    // Sprawdzamy, czy w bazie jest dokładnie 1 blog
    assert.strictEqual(blogsAtEnd.length, 1)

    // Sprawdzamy, czy zapisany blog ma poprawne powiązanie z ID użytkownika
    const savedBlog = blogsAtEnd[0]
    assert.strictEqual(savedBlog.user.toString(), user.id)
  })
})

// Na samym końcu zamykamy połączenie z bazą, żeby terminal nie wisiał
after(async () => {
  await mongoose.connection.close()
})