const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('login API', () => {
  // Przed każdym testem czyścimy bazę i dodajemy jednego użytkownika z jawnym, znanym nam hasłem
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('mojetajnehaslo', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash
    })

    await user.save()
  })

  test('succeeds with correct credentials and returns a token', async () => {
    const loginDetails = {
      username: 'root',
      password: 'mojetajnehaslo' // Używamy poprawnego jawnego hasła
    }

    const result = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Sprawdzamy, czy serwer zwrócił nam wygenerowany token
    assert(result.body.token !== undefined)
    assert.strictEqual(result.body.username, 'root')
  })

  test('fails with status 401 and proper message for invalid password', async () => {
    const invalidLoginDetails = {
      username: 'root',
      password: 'zlehaslo123' // Używamy błędnego hasła
    }

    const result = await api
      .post('/api/login')
      .send(invalidLoginDetails)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    // Sprawdzamy, czy API zwróciło odpowiedni komunikat błędu
    assert(result.body.error.includes('nieprawidłowa nazwa użytkownika lub hasło'))
  })
})

after(async () => {
  await mongoose.connection.close()
})