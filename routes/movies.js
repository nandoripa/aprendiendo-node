import { Router } from 'express'
import { randomUUID } from 'node:crypto'

import { readJSON } from '../utils.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

const movies = readJSON('./movies.json')

export const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )

    if (filteredMovies.length > 0) return res.json(filteredMovies)
    res.status(404).json({ message: `Movies not found by genre ${genre}` })
  }
  res.json(movies)
})

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', (req, res) => {
  const validateResult = validateMovie(req.body)
  if (validateResult.error) return res.status(400).json({ error: JSON.parse(validateResult.error.message) })

  const newMovie = {
    id: randomUUID(),
    ...validateResult.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

moviesRouter.patch('/:id', (req, res) => {
  const validateResult = validatePartialMovie(req.body)
  if (validateResult.error) return res.status(400).json({ error: JSON.parse(validateResult.error.message) })

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) { return res.status(404).json({ message: 'Movie not found' }) }

  const updatedMovie = {
    ...movies[movieIndex],
    ...validateResult.data
  }
  movies[movieIndex] = updatedMovie
  res.status(200).json(updatedMovie)
})

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) { return res.status(404).json({ message: 'Movie not found' }) }

  movies.splice(movieIndex, 1)
  res.json({ message: ';Movie deleted' })
})
