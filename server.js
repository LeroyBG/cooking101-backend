import dotenv from 'dotenv'
import express from "express"
import cors from 'cors'
import userRouter from './routes/users.js'


// configure environment variables
dotenv.config()
const PORT = process.env.PORT ?? 3005

// initialize express app
const app = express()
app.use(cors())
app.use(express.json())

app.all('/', (req, res) => {
    res.send('Hi!')
})

app.use('/users', userRouter)

app.listen(PORT, 
() => {
    console.log(`server running on port, ${PORT}`)
}).on('error', (e) => {
    console.log(e)
})

