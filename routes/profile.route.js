const {Router} = require('express')
const config = require('config')
const User = require('../models/User')
const router = Router()
const fs = require('fs')
const ObjectID = require("mongodb").ObjectID
const authMiddleware = require('../middleware/auth.middleware')


// /api/profile
router.get(
  '/profile/:id', 
  async (req, res)=>{
    try{
      const userId = req.params.id

      if(!ObjectID.isValid(userId)){
        return res.status(400).json({
          message: "пользователь не найден"
        })
      }

      const user = await User.findById(userId).exec()

      res.json(user)

    }catch(e){
      res.status(500).json({message: "что-то пошло не так profile page"})
    }

  })


router.post(
  '/avatar', 
  authMiddleware,
  async (req, res)=>{
    try{
      const file = req.files.file
      const parent = await File.findOne( {user: req.user.id, _id: req.body.parent} )
      const user = await User.findOne({_id: req.user.id})

      if(user.usedSpace + file.size > user.diskSpace){
        return res.status(400).json({
          message: "нет места на диске"
        })
      }

      user.usedSpace = user.usedSpace + file.size

      let path;

      if (parent){
        path = `${config.get('filePath')}\\${user._id}\\${parent.path}\\${file.name}`
      }else{
        path = `${config.get('filePath')}\\${user._id}\\${file.name}`
      }

      if(fs.existsSync(path)){
        return res.status(400).json({
          message: "такой файл уже существует"
        })
      }

      file.mv(path)

      const type = file.name.split('.').pop()
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: parent.path,
        parent: parent._id,
        user: user._id
      })

      await dbFile.save()
      await user.save()


      res.json(dbFile)

    }catch(e){
      res.status(500).json({message: "что-то пошло не так avatar"})
    }

  })

module.exports = router