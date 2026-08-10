const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')
const { sendMail } = require('../services/mailService')



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

const GENERIC_FORGOT_MESSAGE =
  'If an account with that email exists, a password reset link has been sent.'

// /api/auth/forgot-password
router.post(
  '/forgot-password',
  [check('email', 'Invalid email').normalizeEmail().isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Invalid email',
        })
      }

      const { email } = req.body
      const user = await User.findOne({ email })

      // Always return the same message (do not leak whether the email exists)
      if (!user) {
        return res.json({ message: GENERIC_FORGOT_MESSAGE })
      }

      const rawToken = crypto.randomBytes(32).toString('hex')
      const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex')

      user.resetPasswordToken = hashedToken
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      await user.save()

      const clientUrl = config.get('clientUrl')
      const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`

      await sendMail({
        to: user.email,
        subject: 'Reset your Circle password',
        text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
        html: `
          <p>You requested a password reset for your Circle account.</p>
          <p><a href="${resetUrl}">Reset password</a></p>
          <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
        `,
      })

      return res.json({ message: GENERIC_FORGOT_MESSAGE })
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Could not process password reset request' })
    }
  }
)

// /api/auth/reset-password
router.post(
  '/reset-password',
  [
    check('token', 'Reset token is required').notEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Invalid reset data',
        })
      }

      const { token, password } = req.body
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      })

      if (!user) {
        return res.status(400).json({
          message: 'Reset link is invalid or has expired',
        })
      }

      user.password = await bcrypt.hash(password, 12)
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      return res.json({ message: 'Password has been reset. You can log in now.' })
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Could not reset password' })
    }
  }
)

module.exports = router
