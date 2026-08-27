import { useNotification } from '../store/notifyStore'
import { Alert } from '@mui/material'

const Notification = () => {
  const { notification, type } = useNotification()
  if (notification === null) {
    return null
  }

  return (
    <Alert style={{ marginBottom: 5, marginTop: 5 }} severity={type}>
      {notification}
    </Alert>
  )
}

export default Notification
