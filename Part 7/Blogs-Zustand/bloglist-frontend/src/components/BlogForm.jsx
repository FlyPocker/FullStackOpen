import { useBlogActions } from '../store/blogStore'
import { useNotificationActions } from '../store/notifyStore'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = () => {
  const { addBlog } = useBlogActions()
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()
  const style = {
    marginBottom: 5,
    marginTop: 5,
  }

  const handleCreateBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    })
    setNotification(
      `Dodano nowego bloga: ${event.target.title.value}`,
      'success'
    )
    navigate('/')
    event.target.reset()
  }

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>
            <TextField style={style} label="name" type="text" name="title" />
          </label>
        </div>
        <div>
          <label>
            <TextField style={style} label="author" type="text" name="author" />
          </label>
        </div>
        <div>
          <label>
            <TextField style={style} label="url" type="text" name="url" />
          </label>
        </div>
        <Button style={style} variant="contained" type="submit">
          create
        </Button>
      </form>
    </>
  )
}

export default BlogForm
