import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import { applicationDefault, initializeApp } from "firebase-admin/app"

// configure environment variables
dotenv.config()
const PORT = process.env.PORT ?? 3005
const DATABASE_URL = process.env.DATABASE_URL

// initialize express app
const app = express()
app.use(cors())

// initialize firebase app
initializeApp({
    credential: applicationDefault(),
    databaseURL: DATABASE_URL
})

app.use('/', (req, res) => {
    res.send('Hi!')
})

app.listen(PORT, 
() => {
    console.log(`server running on port, ${PORT}`)
}).on('error', (e) => {
    console.log(e)
})