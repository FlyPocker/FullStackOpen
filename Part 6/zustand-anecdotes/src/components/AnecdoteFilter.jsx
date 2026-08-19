import { useAnecdoteActions } from '../store'

const AnecdoteFilter = () => {
    const { setFilter } = useAnecdoteActions()

    return (
        <div>
            filter <input onChange={(e) => setFilter(e.target.value)} />
        </div>
    )
}

export default AnecdoteFilter