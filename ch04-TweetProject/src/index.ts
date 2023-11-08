import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.router'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.router'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_DIR } from './constants/dir'
import staticRouter from './routes/static.router'
config()

const app = express()
const port = process.env.PORT || 4000
initFolder()

databaseService.connect()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter) //route handler
app.use('/medias', mediasRouter) //route handler
// app.use('/static', express.static(UPLOAD_DIR)) //nếu muốn thêm tiền tố, ta sẽ làm thế này
app.use('/static', staticRouter)

// app su dung mot error handler tong
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})
