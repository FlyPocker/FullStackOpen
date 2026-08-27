import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initializeBlogs: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
    addBlog: async (blog) => {
      const newBlog = await blogService.create(blog)
      set((state) => ({
        blogs: [...state.blogs, newBlog],
      }))
    },
    removeBlog: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
      }))
    },
    likeBlog: async (id) => {
      const blog = useBlogStore.getState().blogs.find((b) => b.id === id)
      if (!blog) {
        throw new Error(`Blog with id ${id} not found`)
      }
      const updatedBlog = await blogService.update(id, {
        ...blog,
        likes: blog.likes + 1,
      })
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? updatedBlog : b)),
      }))
    },
    addComment: async (id, comment) => {
      const updatedBlog = await blogService.addComment(id, comment)
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? updatedBlog : b)),
      }))
    },
    removeComment: async (id, commentId) => {
      const blog = useBlogStore.getState().blogs.find((b) => b.id === id)
      if (!blog) {
        throw new Error(`Blog with id ${id} not found`)
      }
      const updatedBlog = await blogService.update(id, {
        ...blog,
        comments: blog.comments.filter((c) => c.id !== commentId),
      })
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? updatedBlog : b)),
      }))
    },
  },
}))

export const useBlog = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
export default useBlogStore
