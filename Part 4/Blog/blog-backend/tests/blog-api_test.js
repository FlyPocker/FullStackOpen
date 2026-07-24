const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('Blog API with authentication', () => {
  let token = null
  let savedUserId = null

  beforeEach(async () => {
    // 1. Czyszczenie bazy
    await Blog.deleteMany({})
    await User.deleteMany({})

    // 2. Tworzenie użytkownika
    const passwordHash = await bcrypt.hash('sekretnehaslo', 10)
    const user = new User({ 
      username: 'root', 
      name: 'Superuser', 
      passwordHash 
    })
    const savedUser = await user.save()
    savedUserId = savedUser.id

    // 3. Logowanie, aby zdobyć token do wykorzystania w testach
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekretnehaslo' })
    
    token = loginResponse.body.token

    // 4. Dodanie jednego początkowego bloga, którego właścicielem jest 'root'
    const initialBlog = new Blog({
      title: 'Początkowy blog w bazie',
      author: 'Michał',
      url: 'https://fullstackopen.com',
      likes: 5,
      user: savedUserId
    })
    await initialBlog.save()
  })

  describe('POST /api/blogs', () => {
    test('succeeds with valid data and token', async () => {
      const newBlog = {
        title: 'Nowy testowy blog',
        author: 'Michał',
        url: 'http://test.pl',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Dodajemy token!
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, 2) // Początkowy + ten nowy

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('Nowy testowy blog'))
    })

    test('fails with status 401 if token is missing', async () => {
      const newBlog = {
        title: 'Blog bez autoryzacji',
        author: 'Haker',
        url: 'http://zly-link.pl',
        likes: 0
      }

      // Próbujemy dodać bez .set('Authorization', ...)
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401) 

      // Upewniamy się, że blog nie został dodany do bazy
      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, 1) 
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('succeeds with status 204 if token is valid and user is creator', async () => {
      // Pobieramy bloga, którego utworzyliśmy w beforeEach
      const blogsAtStart = await Blog.find({})
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`) // Udowadniamy, że jesteśmy autorem
        .expect(204)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, 0) // Baza powinna być pusta
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})