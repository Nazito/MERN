const { Router } = require('express')
const ObjectID = require('mongodb').ObjectID
const authMiddleware = require('../middleware/auth.middleware')
const User = require('../models/User')
const Friendship = require('../models/Friendship')
const {
  USER_PUBLIC,
  idsEqual,
  findBetween,
  friendshipStatus,
  mapFriendUser,
  acceptedFriendsFor,
} = require('../services/friendsService')
const { emitToUser } = require('../services/socketService')

const router = Router()

// GET /api/friends — my accepted friends
router.get('/', authMiddleware, async (req, res) => {
  try {
    const friends = await acceptedFriendsFor(req.user.userId)
    res.json({ friends })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load friends' })
  }
})

// GET /api/friends/requests — incoming pending
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const rows = await Friendship.find({
      recipient: req.user.userId,
      status: 'pending',
    })
      .populate('requester', USER_PUBLIC)
      .exec()

    res.json({
      requests: rows.map((row) => ({
        _id: row._id,
        from: mapFriendUser(row.requester),
        createdAt: row.createdAt,
      })),
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load friend requests' })
  }
})

// GET /api/friends/of/:userId — accepted friends of any user
router.get('/of/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    const friends = await acceptedFriendsFor(userId)
    res.json({ friends })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load friends' })
  }
})

// GET /api/friends/status/:userId
router.get('/status/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    if (idsEqual(userId, req.user.userId)) {
      return res.json({ status: 'self' })
    }

    const doc = await findBetween(req.user.userId, userId)
    res.json({ status: friendshipStatus(doc, req.user.userId) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load friendship status' })
  }
})

// POST /api/friends/:userId — send request
router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    const me = req.user.userId

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    if (idsEqual(userId, me)) {
      return res.status(400).json({ message: 'Cannot add yourself' })
    }

    const target = await User.findById(userId)
    if (!target) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existing = await findBetween(me, userId)
    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ message: 'Already friends' })
      }
      if (idsEqual(existing.requester, me)) {
        return res.status(400).json({ message: 'Friend request already sent' })
      }
      existing.status = 'accepted'
      await existing.save()

      const meUser = await User.findById(me).select(USER_PUBLIC)
      emitToUser(userId, 'friend:accepted', {
        by: mapFriendUser(meUser),
      })

      return res.json({
        status: 'friends',
        message: 'Friend request accepted',
      })
    }

    const friendship = await Friendship.create({
      requester: me,
      recipient: userId,
      status: 'pending',
    })

    const meUser = await User.findById(me).select(USER_PUBLIC)
    emitToUser(userId, 'friend:request', {
      _id: String(friendship._id),
      from: {
        ...mapFriendUser(meUser),
        _id: String(meUser._id),
      },
      createdAt: friendship.createdAt,
    })

    res.status(201).json({
      status: 'pending_sent',
      message: 'Friend request sent',
    })
  } catch (e) {
    console.error(e)
    if (e.code === 11000) {
      return res.status(400).json({ message: 'Friend request already exists' })
    }
    res.status(500).json({ message: 'Could not send friend request' })
  }
})

// POST /api/friends/:userId/accept
router.post('/:userId/accept', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    const me = req.user.userId

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }

    const doc = await Friendship.findOne({
      requester: userId,
      recipient: me,
      status: 'pending',
    })

    if (!doc) {
      return res.status(404).json({ message: 'Friend request not found' })
    }

    doc.status = 'accepted'
    await doc.save()

    const meUser = await User.findById(me).select(USER_PUBLIC)
    emitToUser(userId, 'friend:accepted', {
      by: mapFriendUser(meUser),
    })

    res.json({ status: 'friends', message: 'Friend request accepted' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not accept friend request' })
  }
})

// POST /api/friends/:userId/decline — decline incoming or cancel outgoing
router.post('/:userId/decline', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    const me = req.user.userId

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }

    const doc = await findBetween(me, userId)
    if (!doc || doc.status !== 'pending') {
      return res.status(404).json({ message: 'Friend request not found' })
    }

    await doc.remove()
    res.json({ status: 'none', message: 'Friend request removed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not decline friend request' })
  }
})

// DELETE /api/friends/:userId — unfriend
router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    const me = req.user.userId

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }

    const doc = await findBetween(me, userId)
    if (!doc || doc.status !== 'accepted') {
      return res.status(404).json({ message: 'Friendship not found' })
    }

    await doc.remove()
    res.json({ status: 'none', message: 'Removed from friends' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not remove friend' })
  }
})

module.exports = router
