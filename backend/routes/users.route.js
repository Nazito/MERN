const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()


// /api/humans
router.get(
  '/humans', 
  async (req, res)=>{
    try{
      const users = await User.find({})
        .select('-password -resetPasswordToken -resetPasswordExpires -__v')
        .lean()
      res.json({users})
    }catch(e){
      res.status(500).json({message: "что-то пошло не так users.route"})
    }
  })

module.exports = router