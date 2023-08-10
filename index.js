import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import cors from 'cors'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'

const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8000'
    ]

    if ((ACCEPTED_ORIGINS.includes(origin) || !origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/movies', (req, res) => {
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

app.post('/movies', (req, res) => {
  const validateResult = validateMovie(req.body)
  if (validateResult.error) return res.status(400).json({ error: JSON.parse(validateResult.error.message) })

  const newMovie = {
    id: randomUUID(),
    ...validateResult.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.patch('/movies/:id', (req, res) => {
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

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) { return res.status(404).json({ message: 'Movie not found' }) }

  movies.splice(movieIndex, 1)
  res.json({ message: ';Movie deleted' })
})

/* app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (validateOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  }
  res.send(200)
}) */

const PORT = process.env.port ?? 3000

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
