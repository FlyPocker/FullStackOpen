const blogsRouter = require('express').Router()
const { default: blogs } = require('../../bloglist-frontend/src/services/blogs')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // ZAMIAST User.findById(body.userId) używamy zweryfikowanego użytkownika z middleware
  const user = request.user

  // Jeśli middleware nie znalazł tokena, user jest pusty -> odrzucamy
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Dodajemy logikę dla zadania 4.23 (Bezpieczne usuwanie)
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  console.log('--- DEBUG DELETE ---')
  console.log(
    'Czy backend widzi usera (z tokena)?:',
    user ? user.username : 'BRAK USERA'
  )
  console.log('ID usera z tokena:', user?.id)
  console.log('ID autora bloga:', blog?.user?.toString())
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!blog) {
    return response.status(204).end()
  }

  // Sprawdzamy czy ID twórcy bloga zgadza się z ID zalogowanego usera z tokena
  // Używamy .toString(), by porównać same wartości znakowe
  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(403)
      .json({ error: 'only the creator can delete blogs' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  const newComment = body.comment
  if (!newComment) {
    return response.status(400).json({ error: 'comment is required' })
  }

  blog.comments = blog.comments.concat(newComment)
  await blog.save()

  response.status(201).json(blog)
})

module.exports = blogsRouter
