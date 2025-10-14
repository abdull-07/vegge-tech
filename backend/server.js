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


const allowedOrigins = ['https://vegge-tech.vercel.app', 'http://localhost:5173'] // Allow multiple origins

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware Configs
app.use(express.json()) // to parse JSON body
app.use(cookieParser())
app.use(cors(corsOptions))

// Handle preflight requests
app.options('*', cors(corsOptions));

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
