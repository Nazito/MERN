const fileService = require('../services/fileService')
const cloudinaryService = require('../services/cloudinaryService')
const User = require('../models/User')
const File = require('../models/File')
const config = require('config')
const fs = require('fs')

class FileController {

  async createDir(req, res){

    try{
      
      const {name, type, parent} = req.body
      const file = new File({name, type, parent, user: req.user.userId})
      const parentFile = await File.findOne({_id: parent})
      

      if(!parentFile){
        file.path = name
        await fileService.createDir(file)

      }else{
        file.path = `${parentFile.path}/${file.name}`
        await fileService.createDir(file)
        parentFile.childs.push(file._id)
        await parentFile.save()
      }
      

      await file.save()

      return res.json(file)

    }catch(e){
      return res.status(400).json(e)
    }
  }

  async getFiles(req, res){
    try{
      const {sort} = req.query
      let files 
      switch (sort){
        case 'name':
          files = await File.find({user: req.user.userId, parent: req.query.parent}).sort({name:1})
          break
        case 'type':
          files = await File.find({user: req.user.userId, parent: req.query.parent}).sort({type:1})
          break
        case 'data':
          files = await File.find({user: req.user.userId, parent: req.query.parent}).sort({data:1})
          break
        default:
          files = await File.find({user: req.user.userId, parent: req.query.parent})
          break
      }

      
      return res.json({files})

    }catch(e){
      console.log(e)
      return res.status(500).json({message: "Can not get files"})
    }
  }

  async uploadFile(req, res){
    try{

      const file = req.files.file
      const parent = await File.findOne({user: req.user.userId, _id: req.body.parent})
      const user = await User.findOne({_id: req.user.userId})

      if(user.usedSpace + file.size > user.diskSpace){
        return res.status(400).json({message: "There no space on the disk"})
      }

      user.usedSpace = user.usedSpace + file.size

      let path;
     

      if(parent){
        path = `${config.get('filePath')}/${user._id}/${parent.path}/${file.name}`
      }else{
        path = `${config.get('filePath')}/${user._id}/${file.name}`
      }

      if(fs.existsSync(path)){
        return res.status(400).json({message: "File already exist"})
      }

      file.mv(path)
      
      const type = file.name.split('.').pop()

      let filePath = file.name

      if(parent){
        filePath = `${parent.path}/${file.name}`
      }

      const dbFile = new File({
        name: file.name,
        type, 
        size: file.size,
        path: filePath,
        parent: parent ? parent._id : null,
        user: user._id
      })

      await dbFile.save()
      await user.save()

      return res.json(dbFile)

    }catch(e){
      console.log(e)
      return res.status(500).json({message: "Upload error"})
    }
  }

  async downloadFile(req, res){
    try{
      const file = await File.findOne({_id: req.query.id, user: req.user.userId})
      const path = fileService.getPath(file)

      if(fs.existsSync(path)){
        return res.download(path, file.name)
      }

      return res.status(400).json({message: "Download error"})

    }catch(e){
      console.log(e)
      return res.status(500).json({message: "Download error"})
    }
  }

  async deleteFile(req, res){
    try{
      const file = await File.findOne({_id: req.query.id, user: req.user.userId})

      console.log('file 777',file)

      if(!file){
        return res.status(400).json({message: "Delete file not found"})
      }

      await fileService.deleteFile(file)
      await file.remove()
      return res.json({message: "File was deleted"})

    }catch(e){
      console.log(e)
      return res.status(500).json({message: "Delete error"})
    }
  }

  async searchFile(req, res){
    try{
      const searchName = req.query.search
      let files = await File.find({user: req.user.userId})
      files = files.filter(file => file.name.includes(searchName))

      return res.json(files)

    }catch(e){
      console.log(e)
      return res.status(500).json({message: "Search error"})
    }
  }

  async uploadAvatar(req, res){
    try{
      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const file = req.files.file
      const user = await User.findById(req.user.userId).exec()
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const uploaded = await cloudinaryService.uploadAvatarFile(file)

      // Remove previous Cloudinary asset
      await cloudinaryService.deleteAvatarAsset(user.avatarPublicId)

      user.avatar = uploaded.url
      user.avatarPublicId = uploaded.publicId
      await user.save()

      const safe = user.toObject()
      delete safe.password
      delete safe.resetPasswordToken
      delete safe.resetPasswordExpires
      return res.json(safe)

    }catch(e){
      console.log(e)
      return res.status(500).json({message: "Upload avatar error"})
    }
  }

  async deleteAvatar(req, res){
    try{
      const user = await User.findById(req.user.userId).exec()
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      await cloudinaryService.deleteAvatarAsset(user.avatarPublicId)

      user.avatar = null
      user.avatarPublicId = undefined
      await user.save()

      const safe = user.toObject()
      delete safe.password
      delete safe.resetPasswordToken
      delete safe.resetPasswordExpires
      return res.json(safe)

    }catch(e){
      console.log(e)
      return res.status(500).json({message: "Delete avatar error"})
    }
  }
 
}

module.exports = new FileController()