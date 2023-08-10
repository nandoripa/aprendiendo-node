import { randomUUID } from 'node:crypto'

import { readJSON } from '../utils.js'
const movies = readJSON('./movies.json')

export class Movie {
  static async getAll ({ genre }) {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  static async getById ({ id }) {
    return movies.find(movie => movie.id === id)
  }

  static async create ({ movieData }) {
    const newMovie = {
      id: randomUUID(),
      ...movieData
    }
    movies.push(newMovie)
    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) { return false }

    movies.splice(movieIndex, 1)
    return true
  }

  static async update ({ id, movieData }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) { return null }

    const updatedMovie = {
      ...movies[movieIndex],
      ...movieData
    }
    movies[movieIndex] = updatedMovie
    return updatedMovie
  }
}
