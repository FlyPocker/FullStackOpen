import { AppBar, Toolbar, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useUser } from '../store/userStore'
import { useNotificationActions } from '../store/notifyStore'
import { useUserActions } from '../store/userStore'

const Navigation = () => {
  const { user } = useUser()
  const { logout } = useUserActions()
  const { setNotification } = useNotificationActions()

  const handleLogout = () => {
    logout()
    setNotification('Wylogowano', 'success')
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Button color="inherit" component={Link} to="/create">
          new blog
        </Button>
        {user === null ? (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/"
            onClick={handleLogout}
          >
            logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
export default Navigation
