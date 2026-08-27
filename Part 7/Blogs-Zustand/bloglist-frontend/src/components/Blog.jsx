import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlog, useBlogActions } from '../store/blogStore'
import { useUser } from '../store/userStore'
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItemText,
  TextField,
} from '@mui/material'

const Blog = () => {
  const id = useParams().id
  const blogs = useBlog()
  const blog = blogs.find((b) => b.id === id)
  const { likeBlog, removeBlog, addComment } = useBlogActions()
  const { user } = useUser()
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const blogStyle = {
    marginBottom: 10,
    marginTop: 10,
  }

  const handleRemoveBlog = () => {
    if (window.confirm(`Are you sure you want to remove ${blog.title}?`)) {
      removeBlog(id)
    }
    navigate('/')
  }
  const RemoveButtonVisibility = () => {
    return user !== null && user.username === blog.user.username ? (
      <Button
        variant="contained"
        color="inherit"
        style={{ marginLeft: 10 }}
        component={Link}
        to="/"
        onClick={() => handleRemoveBlog()}
      >
        Remove
      </Button>
    ) : (
      <></>
    )
  }

  return (
    <Card style={blogStyle}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {blog.title} {blog.author}
        </Typography>
        <Typography color="textSecondary">Likes: {blog.likes}</Typography>

        <Typography color="textSecondary">{blog.url}</Typography>
        <Typography color="textSecondary">Author: {blog.user.name}</Typography>
        {user !== null ? (
          <Button variant="contained" onClick={() => likeBlog(blog.id)}>
            Like
          </Button>
        ) : null}
        <RemoveButtonVisibility />
        <Typography variant="h6" component="h3" style={{ marginTop: 10 }}>
          Comments:
        </Typography>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const comment = event.target.comment.value
            if (comment) {
              addComment(blog.id, comment)
              event.target.comment.value = ''
            }
          }}
        >
          <TextField
            type="text"
            name="comment"
            placeholder="Add a comment..."
          />
          <Button
            style={{ marginLeft: 10, marginTop: 10 }}
            type="submit"
            variant="contained"
          >
            Add Comment
          </Button>
        </form>
        <List>
          {blog.comments.map((comment, index) => (
            <ListItemText key={index} primary={comment} />
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default Blog
