import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'

test('5.13: renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Testing React Apps',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: {
      name: 'John Doe', // Dodajemy sztucznego użytkownika, żeby testy nie płakały
    },
  }

  // Renderujemy komponent z atrapą danych
  render(<Blog blog={blog} />)

  // Oczekujemy, że tytuł i autor będą widoczne w DOM
  const element = screen.getByText('Testing React Apps Test Author', {
    exact: false,
  })
  expect(element).toBeDefined()

  // Oczekujemy, że url i polubienia NIE są domyślnie wyrenderowane
  expect(screen.getByText('http://example.com')).not.toBeVisible()
  expect(screen.getByText('10', { exact: false })).not.toBeVisible()
})

test('5.14: shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Testing React Apps',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: {
      name: 'John Doe', // Dodajemy sztucznego użytkownika, żeby testy nie płakały
    },
  }

  render(<Blog blog={blog} />)

  // Inicjalizujemy symulację użytkownika i klikamy przycisk rozwijania
  const user = userEvent.setup()
  const button = screen.getByText('show') // Upewnij się, że masz dokładnie taki tekst na przycisku u siebie
  await user.click(button)

  // Po kliknięciu te elementy powinny pojawić się w wirtualnym DOM
  expect(screen.getByText('http://example.com', { exact: false })).toBeDefined()
  expect(screen.getByText('10', { exact: false })).toBeDefined()
})

test('5.15: like button clicked twice calls event handler twice', async () => {
  const blog = {
    title: 'Testing React Apps',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: {
      name: 'John Doe', // Dodajemy sztucznego użytkownika, żeby testy nie płakały
    },
  }

  const mockHandler = vi.fn() // Tworzymy naszą fałszywą funkcję

  // Przekazujemy fałszywą funkcję jako props do komponentu
  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()

  // Najpierw musimy rozwinąć bloga, żeby przycisk "like" stał się w ogóle widoczny
  const viewButton = screen.getByText('show')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')

  // Symulujemy dwa szybkie kliknięcia
  await user.click(likeButton)
  await user.click(likeButton)

  // Sprawdzamy czy nasza atrapa funkcji zapisała dokładnie dwa wywołania
  expect(mockHandler.mock.calls).toHaveLength(2)
})
