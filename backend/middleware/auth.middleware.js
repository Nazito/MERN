const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  
  if(req.method === 'OPTIONS' ){
    return next()
  }

  try{
    const token = req.headers.authorization

    if(token){
      const jwtPart = token.split(' ')[1]
      const decoded = jwt.verify(jwtPart, config.get('jwtSecret'))
      req.user = decoded
      next()
    }else{
      return res.status(401).json({message:'Auth error token not found'}) 
    }

  }catch (e) {
    console.log(e)
    return res.status(411).json({message:'Auth middleware error'})
  }
}