import { Movie } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await Movie.getAll({ genre })
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await Movie.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const validateResult = validateMovie(req.body)
    if (validateResult.error) return res.status(400).json({ error: JSON.parse(validateResult.error.message) })
    const newMovie = await Movie.create({ movieData: validateResult.data })

    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const validateResult = validatePartialMovie(req.body)
    if (validateResult.error) return res.status(400).json({ error: JSON.parse(validateResult.error.message) })

    const { id } = req.params
    const updatedMovie = await Movie.update({ id, movieData: validateResult.data })

    if (updatedMovie === null) { return res.status(404).json({ message: 'Movie not found' }) }
    res.status(200).json(updatedMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const deleted = await Movie.delete({ id })

    if (!deleted) { return res.status(404).json({ message: 'Movie not found' }) }

    res.json({ message: ';Movie deleted' })
  }
}
