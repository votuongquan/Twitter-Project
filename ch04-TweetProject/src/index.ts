import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.router'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()
const port = 4000

databaseService.connect()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter) //route handler

// app su dung mot error handler tong
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})
