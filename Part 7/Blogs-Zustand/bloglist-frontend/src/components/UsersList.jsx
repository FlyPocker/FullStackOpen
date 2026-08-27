import { Link } from 'react-router-dom'
import { useUser } from '../store/userStore'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'

const UsersList = () => {
  const { user, users } = useUser()

  const style = {
    marginBottom: 10,
    marginTop: 10,
  }

  return (
    <TableContainer style={style} component={Paper}>
      <Table>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </TableCell>
              <TableCell>Author: {user.name}</TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default UsersList
