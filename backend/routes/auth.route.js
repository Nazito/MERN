const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')



// /api/auth/register
router.post(
  '/register', 
  [
    check('email', "некорректный email").isEmail(),
    check('password', "Минимальная длина пароля 6 символов").isLength({min:6})
  ],
  async (req, res)=>{
    try{

      // console.log(req.body)
      const errors = validationResult(req)
     
      if(!errors.isEmpty()){
        return res.status(400).json({
          errors: errors.array(),
          message: "некорректные данные при регистрации"
        })
      }
      const {email, password, name} = req.body
      const candidate = await User.findOne({email})

      if(candidate) {
        return res.status(400).json({message: 'такой пользователь уже существует'})
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ name, email, password: hashedPassword, isAuth: true})

      await user.save()

      const registerToken = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
      )

      await fileService.createDir(new File({user: user.id, name: ""}))
      // console.log("442332")

      res.status(201).json({
        registerToken,
        user:{
          message: "пользователь создан"
        }
      })


    }catch(e){
      res.status(500).json({message: "что-то пошло не так register"})
    }
})

// /api/auth/login
router.post(
  '/login', 
  [
    check('email', "некорректный email login").normalizeEmail().isEmail(),
    check('password', "Минимальная длина пароля 6 символов").exists()
  ],
  async (req, res)=>{
    //  const users = await User.find({})
    // console.log(users)
    try{
      const errors = validationResult(req)

      if(!errors.isEmpty()){
        return res.status(400).json({
          errors: errors.array(),
          message: "некорректные данные при входе в систему"
        })
      }

      const {email, password} = req.body
      const user = await User.findOne({email})

      if(!user){
        return res.status(400).json({
          message: "пользователь не найден"
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch){
        return res.status(400).json({message: "неверный пароль"})
      }

      const loginToken = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
      )

      res.json({
        loginToken,
        user:{
          name: user.name, 
          userId: user.id,
          message: "login succes"
        }
      })

    }catch(e){
      res.status(500).json({message: "что-то пошло не так login"})
    }

  })


  // /api/auth/me
router.get(
  '/me', 
  authMiddleware,
  async (req, res)=>{
    
    try{
      const user = await User.findById(req.user.userId).exec()

      const token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
      )

      return res.json({
        token,
        user:{
          name: user.name, 
          userId: user.id,
          message: "login succes"
        }
      })

    }catch(e){
      res.status(500).json({message: "что-то пошло не так Auth me"})
    }

  })

module.exports = router