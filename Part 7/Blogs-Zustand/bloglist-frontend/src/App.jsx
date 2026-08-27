import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import ErrorBoundary from './components/ErrorBoundary'
import Navigation from './components/Navigation'
import { useUserActions } from './store/userStore'
import { useBlogActions } from './store/blogStore'
import UsersList from './components/UsersList'
import User from './components/User'

const App = () => {
  const { initializeUser, logout } = useUserActions()
  const { initializeBlogs } = useBlogActions()
  useEffect(() => {
    initializeUser()
    initializeBlogs()
  }, [initializeUser, initializeBlogs])

  const blogFormRef = useRef()

  /*const handleLogin = async ({ username, password }) => {
    const user = await loginService.login({ username, password })
    setUser(user)
    blogService.setToken(user.token)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    handleNotification(`Zalogowano jako ${user.name}`)
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    handleNotification('Wylogowano')
  }

  const handleCreateBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      handleNotification('Blog utworzony')
      blogFormRef.current.toggleVisibility()
    })
  }
  const handleRemoveBlog = async (blogID) => {
    try {
      await blogService.remove(blogID)
      console.log('removing', blogID)
      setBlogs(blogs.filter((blog) => blog.id !== blogID))
    } catch (error) {
      console.log('Error while removing blog', error)
      handleNotification('Blad usuwania')
    }
  }

  const handleLike = async (id, blogToUpdate) => {
    try {
      const returnedBlog = await blogService.update(id, blogToUpdate)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
    } catch (error) {
      console.log('Error while handling likes', error)
      handleNotification('Blad likowania')
    }
  }*/
  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <Navigation />
      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </ErrorBoundary>
    </Router>
  )
}

export default App
