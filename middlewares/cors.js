import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8000'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if ((ACCEPTED_ORIGINS.includes(origin) || !origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
