import express from 'express'
import { config } from 'dotenv'
import { initFolder } from './utils/file'
import usersRouter from './routes/users.router'
import staticRouter from './routes/static.router'
import mediasRouter from './routes/medias.router'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
config()

const app = express()
const port = process.env.PORT || 4000
initFolder()

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
})

app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter) //route handler
app.use('/medias', mediasRouter) //route handler
app.use('/static', staticRouter) //route handler

// app su dung mot error handler tong
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})
