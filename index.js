import express, { json } from 'express'

import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

app.use('/movies', moviesRouter)

/* app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (validateOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  }
  res.send(200)
}) */

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
