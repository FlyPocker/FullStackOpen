import { Link } from 'react-router-dom'
import { useBlog } from '../store/blogStore'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'

const Home = () => {
  const blogs = useBlog()
  const style = {
    marginBottom: 10,
    marginTop: 10,
  }

  return (
    <TableContainer style={style} component={Paper}>
      <Table>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
              <TableCell>{blog.author}</TableCell>
              <TableCell>{blog.likes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default Home
