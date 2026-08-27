import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect, test, vi } from 'vitest'

test('5.16: form calls event handler with right details when new blog is created', async () => {
  // 1. Tworzymy naszą atrapę funkcji, która normalnie wysyłałaby dane do backendu
  const createBlogMock = vi.fn()
  const user = userEvent.setup()

  // UWAGA 1: Podmień 'createBlog' na nazwę propsa, którego używasz w swoim BlogForm!
  // (może to być np. addBlog, handleCreate, handleSubmit itp.)
  render(<BlogForm createBlog={createBlogMock} />)

  // UWAGA 2: Szukamy inputów po ich atrybucie placeholder.
  // Upewnij się, że w BlogForm.jsx masz takie placeholdery dla tytułu, autora i URL.
  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')

  // UWAGA 3: Upewnij się, że przycisk zatwierdzający formularz nazywa się u Ciebie 'create'
  const sendButton = screen.getByText('create')

  // Symulujemy wpisywanie tekstu przez użytkownika
  await user.type(title, 'Testowy tytuł wpisu')
  await user.type(author, 'Testowy Autor')
  await user.type(url, 'http://testurl.com')

  // Symulujemy kliknięcie przycisku dodawania
  await user.click(sendButton)

  // Sprawdzamy, czy mock-funkcja została wywołana dokładnie raz
  expect(createBlogMock.mock.calls).toHaveLength(1)

  // Sprawdzamy, czy funkcja otrzymała poprawny obiekt jako argument
  // mock.calls[0][0] oznacza: [pierwsze wywołanie funkcji][pierwszy argument tej funkcji]
  expect(createBlogMock.mock.calls[0][0].title).toBe('Testowy tytuł wpisu')
  expect(createBlogMock.mock.calls[0][0].author).toBe('Testowy Autor')
  expect(createBlogMock.mock.calls[0][0].url).toBe('http://testurl.com')
})
