import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../store'

const AnecdoteForm = () => {
    const { addAnecdote } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.reset()
        addAnecdote(content)
        setNotification(`You added '${content}'`)
      }}>
        <div>
          <input name="note" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm