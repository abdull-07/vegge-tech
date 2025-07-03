import cookieParser from 'cookie-parser'
import express  from 'express'
import cors from 'cors'
import connectDB from './configs/db.js'
import 'dotenv/config'


const app = express()
const port = process.env.port || 3000

// Alowed origins
const allowedOrigins = ['http://localhost:5173']

await connectDB()

// !Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, Credential: true}))

app.get('/', (req, res) => {
  res.send('Backend server  running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
