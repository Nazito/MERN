const {Router} = require('express')
const User = require('../models/User')
const router = Router()
const ObjectID = require('mongodb').ObjectID
const authMiddleware = require('../middleware/auth.middleware')

function publicProfile(user) {
  if (!user) return null
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user }
  delete obj.password
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpires
  delete obj.__v
  return obj
}

// /api/profile/:id
router.get('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({
        message: 'User not found',
      })
    }

    const user = await User.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .exec()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(publicProfile(user))
  } catch (e) {
    res.status(500).json({ message: 'Could not load profile' })
  }
})

// /api/profile  (update own profile)
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { name, bio } = req.body

    if (typeof name === 'string') {
      const trimmed = name.trim()
      if (trimmed.length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters' })
      }
      user.name = trimmed
    }

    if (typeof bio === 'string') {
      user.bio = bio.trim().slice(0, 160)
    }

    await user.save()
    res.json(publicProfile(user))
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not update profile' })
  }
})

module.exports = router
