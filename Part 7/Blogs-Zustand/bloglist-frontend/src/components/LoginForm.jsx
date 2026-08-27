import { useNavigate } from 'react-router-dom'
import { useUserActions } from '../store/userStore'
import { useNotificationActions } from '../store/notifyStore'
import { Button, TextField } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const { login } = useUserActions()
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()

  const style = {
    marginBottom: 5,
    marginTop: 5,
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.reset()
    await login(username, password)
    setNotification(`Zalogowano jako ${username}`, 'success')
    navigate('/')
  }

  return (
    <div>
      <h2>Log in to blog app</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            <TextField
              style={style}
              label="username"
              name="username"
              type="text"
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              style={style}
              label="password"
              name="password"
              type="password"
            />
          </label>
        </div>
        <Button variant="contained" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}
export default LoginForm
