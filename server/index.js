const express = require('express')
const path = require ('path')
const dotenv = require ('dotenv')
const cookieParser = require ('cookie-parser')

const connectDB  = require ('./config/db')

const userRoutes = require ('./routes/userRoutes')

dotenv.config();

const port = process.env.PORT || 5000;

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())


//http://localhost:5000/
app.use('/api/users', userRoutes)

app.listen(port, () => console.log(`Server running on port : ${port}`))
