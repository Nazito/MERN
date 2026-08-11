const express = require('express')
const http = require('http')
const config = require('config')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const { initSocket } = require('./services/socketService')

const app = express()
const server = http.createServer(app)

app.use(express.json({ extended: true }))

app.use(fileUpload({})) //uploads
app.use('/api/auth', require('./routes/auth.route')) //login/register
app.use('/api/friends', require('./routes/friends.route'))
app.use('/api/messages', require('./routes/messages.route'))
app.use('/api/posts', require('./routes/posts.route'))
app.use('/api', require('./routes/users.route')) //Пользователи
app.use('/api', require('./routes/profile.route')) //user
app.use('/api/files', require('./routes/file.route')) //files

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    initSocket(server)

    server.listen(PORT, () =>
      console.log(`app has been started on ${PORT} (http + websocket)`)
    )
  } catch (e) {
    console.log('server ERROR', e.message)
    process.exit(1)
  }
}

start()
