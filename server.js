import dotenv from 'dotenv'
import express from "express"
import cors from 'cors'
import morgan from 'morgan'

import userRouter from './routes/users.js'
import recipeRouter from './routes/recipes.js'


// configure environment variables
dotenv.config()
const PORT = process.env.PORT ?? 3005

// initialize express app
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.all('/', (req, res) => {
    res.send('Hi!')
})

app.use('/users', userRouter)
app.use('/recipes', recipeRouter)

app.listen(PORT, 
() => {
    console.log(`server running on port, ${PORT}`)
}).on('error', (e) => {
    console.log(e)
})

