const fs = require('fs')
const File = require('../models/File')
const config = require('config')

class FileService {
  createDir(file){
    const filePath = `${config.get('filePath')}/${file.user}/${file.path}`
    return new Promise(((resolve, reject)=>{
      try{

        if(!fs.existsSync(filePath)){
          fs.mkdirSync(filePath) //, { recursive: true }
          return resolve({message: 'File was created'})
        }else{
          return reject("file already exist")
        }

      }catch(e){
        return reject({message: 'file error'})
      }

    }))
  }

  getPath(file){ 
    return config.get('filePath') + '/' + file.user + '/' + file.path
  }

  deleteFile(file){
    const path = this.getPath(file)

    console.log('path',path)

    if(file.type === 'dir'){
      fs.rmdirSync(path)
    }else{
      fs.unlinkSync(path)
    }
  }
}

module.exports = new FileService()