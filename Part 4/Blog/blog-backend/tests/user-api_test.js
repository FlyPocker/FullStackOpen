const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }
    await api.post('/api/users').send(newUser)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'micha',
      name: 'Michal',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400) // Oczekujemy, że serwer odrzuci to zapytanie
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('hasło musi mieć min 3 znaki'))

    const usersAtEnd = await User.find({})
    // Sprawdzamy, czy w bazie NIE pojawił się nowy użytkownik
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})