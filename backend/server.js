import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connnectDB from "./configs/db.js"
import connectCloudinary from './configs/cloudinary.js'
import userRoute from "./routes/userRoute.js"
import sellerRoute from "./routes/sellerRoute.js"
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import addressRoute from './routes/addressRoute.js'
import OrdersRoute from './routes/OrdersRoute.js'
import notificationRoute from './routes/notificationRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import devRoute from './routes/devRoute.js'
import testRoute from './routes/testRoute.js'
// import 'dotenv/config'

// !.env config
dotenv.config()

const app = express()

await connnectDB() // Connect to MongoDB
await connectCloudinary() // connect to cloudinary

const port = process.env.PORT || 3000 // listen on port


const allowedOrigins = ['http://localhost:5173'] // Allow multiple origins

// Middleware Configs
app.use(express.json()) // to parse JSON body
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))

app.get('/', (req, res) => {
  res.send('HOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO GAYAA CONNECTED')
})

// User Routes
app.use('/api/user', userRoute)

// Seller Routes
app.use('/api/seller/', sellerRoute)

// Products Routes
app.use('/api/product', productRoute)

//Cart Routes
app.use('/api/cart', cartRoute)

// Update Address Route
app.use('/api/address', addressRoute)

// Order Route
app.use('/api/order', OrdersRoute)

// Notification Route
app.use('/api/notifications', notificationRoute)

// Payment Route
app.use('/api/payment', paymentRouter);

// Test Route for email verification
app.use('/api/test', testRoute);

// Dev Route (development only)
app.use('/api/dev', devRoute);

// Import review routes
import reviewRoute from './routes/reviewRoute.js';

// Review Routes
app.use('/api/reviews', reviewRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
