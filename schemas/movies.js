import zod from 'zod'

const movieSchema = zod.object({
  title: zod.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: zod.number().int().min(1900).max(2024),
  director: zod.string({
    invalid_type_error: 'Movie director must be a string',
    required_error: 'Movie director is required'
  }),
  duration: zod.number().int().positive(),
  poster: zod.string().url({
    invalid_type_error: 'Movie poster must be a url',
    required_error: 'Movie poster is required'
  }),
  rate: zod.number().min(0).max(10).default(0),
  genre: zod.array(zod.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Crime', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Thriller', 'Horror']))
})

export function validateMovie (object) {
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}
