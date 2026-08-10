const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const app = express() 

app.use(express.json({extended: true}))

app.use(fileUpload({})) //uploads
app.use(express.static('static')) //uploads
app.use('/api/auth', require('./routes/auth.route')) //login/register
app.use('/api', require('./routes/users.route')) //Пользователи
app.use('/api', require('./routes/profile.route')) //user
app.use('/api/files', require('./routes/file.route')) //files

const PORT = config.get('port') || 5000

async function start(){
  try{
   await mongoose.connect(config.get('mongoUri'),{ 
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true 
   })
   app.listen(PORT, ()=>console.log(`app has been started npm i config 777 ${PORT}`)) 
  }catch(e){
    console.log("server ERROR", e.message)
    process.exit(1)
  }
}

start()


