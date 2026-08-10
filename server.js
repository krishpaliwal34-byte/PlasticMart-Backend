import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './database.js'

import Orderroutes from './routes/Orderroutes.js'
import Userroutes from './routes/Userroutes.js'
import FeedbackRoutes from './routes/FeedbackRoutes.js'
import CartOrderRoutes from './routes/CartOrderRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'
import cartroutes from './routes/Cartroutes.js'
import Paymentroutes from './routes/Paymentroutes.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({
  limit: '25mb',
  extended: true
}))

connectDB()

// API ROUTES
app.use("/api/order", Orderroutes)
app.use("/api/cartorder", CartOrderRoutes)
app.use("/api/User", Userroutes)
app.use("/api/cart", cartroutes)
app.use("/api/feedback", FeedbackRoutes)
app.use("/api/dashproducts", ProductRoutes)

// RAZORPAY PAYMENT
app.use("/api/payment", Paymentroutes)

// Vercel ke liye app export
export default app