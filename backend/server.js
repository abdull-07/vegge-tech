import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connnectDB from "./configs/db.js"
import connectCloudinary from './configs/cloudinary.js'
import userRoute from "./routes/userRoute.js"
import sellerRoute from "./routes/sellerRoute.js"
// import 'dotenv/config'

// !.env config
dotenv.config()

const app = express()

await connnectDB() // Connect to MongoDB
await connectCloudinary() // connect to cloudinary

const port = process.env.PROT || 3000 // listion on port


const allowedOrigins = ['http://localhost:5173'] // Allow multiple origins

// Middleware Configs
app.use(express.json()) // to parse JSON body
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// User Routes
app.use('/api/user', userRoute)

// Seller Routes
app.use('/api/seller', sellerRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
