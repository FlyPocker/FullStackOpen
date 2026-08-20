import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, renderHook, act, render, screen } from '@testing-library/react'

vi.mock('../src/services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from '../src/services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from '../src/store'
import AnecdoteList from '../src/components/AnecdoteList'

afterEach(() => {
    cleanup()
})

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: '',
  })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
    it('initialize loads anecdotes from service', async () => {
        const mockAnecdotes = [
            { id: '1', content: 'Anecdote 1', votes: 0 },
            { id: '2', content: 'Anecdote 2', votes: 0 }
        ]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
            await result.current.initializeAnecdotes()
        })

        const { result: resultAnecdotes } = renderHook(() => useAnecdotes())
        expect(resultAnecdotes.current).toEqual(mockAnecdotes)
    })
})
describe('useAnecdotes', () => {
    it('returns anecdotes filtered by number of votes', () => {
        const mockAnecdotes = [
            { id: '1', content: 'Anecdote 1', votes: 0},
            { id: '2', content: 'Anecdote 2', votes: 1}
        ]
        useAnecdoteStore.setState({ anecdotes: mockAnecdotes })

        const { result } = renderHook(() => useAnecdotes())
        expect(result.current[0]).toEqual(mockAnecdotes[1])
    })

    it('correctly sorts after changing number of votes', async () => {
        anecdoteService.update.mockImplementation(async (id, updatedAnecdote) => {
            return updatedAnecdote
        })
        const mockAnecdotes = [
            { id: '1', content: 'Anecdote 1', votes: 0},
            { id: '2', content: 'Anecdote 2', votes: 1}
        ]
        useAnecdoteStore.setState({ anecdotes: mockAnecdotes })

        const { result: resultFirst } = renderHook(() => useAnecdotes())
        const { result: actions } = renderHook(() => useAnecdoteActions())
        expect(resultFirst.current[0]).toEqual(mockAnecdotes[1])
        await act(async () => {
            await actions.current.vote('1')
            await actions.current.vote('1')
        })
        const { result: resultSecond } = renderHook(() => useAnecdotes())
        expect(resultSecond.current[0]).toEqual({ ...mockAnecdotes[0], votes: 2 })
    })
})

describe('AnecdoteList component', () => {
    beforeEach(() => {
        const mockAnecdotes = [
            { id: '1', content: 'Anecdote 1', votes: 0},
            { id: '2', content: 'Anecdote 2', votes: 1}
        ]
        useAnecdoteStore.setState({ anecdotes: mockAnecdotes })
    })
    it('renders anecdotes in correct order', () => {
        render(<AnecdoteList />)
        const anecdoteElements = screen.getAllByText(/Anecdote \d/)
        expect(anecdoteElements[0].textContent).toBe('Anecdote 2')
        expect(anecdoteElements[1].textContent).toBe('Anecdote 1')
    })
    it('renders filtered anecdotes', async () => {
        useAnecdoteStore.setState({ filter: 'Anecdote 1' })
        render(<AnecdoteList />)
        const anecdoteElements = screen.getAllByText(/Anecdote \d/)
        expect(anecdoteElements[0].textContent).toBe('Anecdote 1')
        expect(anecdoteElements).toHaveLength(1)
    })
})

