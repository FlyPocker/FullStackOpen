import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../store'

const AnecdoteList = () => {
    const anecdotes = useAnecdotes()
    const { vote, removeAnecdote } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()
    return (
    <div>
        {anecdotes.map(anecdote => (
            <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() =>{ 
                    vote(anecdote.id)
                    setNotification(`You voted for '${anecdote.content}'`)
                }}>vote</button>
                {anecdote.votes === 0 
                    ? (<button onClick={() =>{
                        removeAnecdote(anecdote.id)
                        setNotification(`You deleted an anecdote '${anecdote.content}'`)
                    }}>delete</button>)
                    : null
                }
            </div>
            </div>
        ))}
    </div>
    )
}

export default AnecdoteList