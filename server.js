import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'

// configure environment variables
dotenv.config()
const PORT = process.env.PORT ?? 3005

// initialize app
const app = express()
app.use(cors())

app.use('/', (req, res) => {
    res.send('Hi!')
})

app.listen(PORT, 
() => {
    console.log(`server running on port, ${PORT}`)
}).on('error', (e) => {
    console.log(e)
})