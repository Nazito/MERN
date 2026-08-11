const { Router } = require('express')
const ObjectID = require('mongodb').ObjectID
const mongoose = require('mongoose')
const authMiddleware = require('../middleware/auth.middleware')
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const { emitToUser } = require('../services/socketService')

const router = Router()
const USER_PUBLIC = 'name avatar bio'

function idsEqual(a, b) {
  return String(a) === String(b)
}

function toObjectId(id) {
  return mongoose.Types.ObjectId(String(id))
}

function mapUser(user) {
  if (!user) return null
  return {
    _id: String(user._id),
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
  }
}

function otherParticipant(conversation, meId) {
  const other = (conversation.participants || []).find(
    (p) => !idsEqual(p._id || p, meId)
  )
  return other
}

async function findOrCreateConversation(meId, otherId) {
  const me = toObjectId(meId)
  const other = toObjectId(otherId)

  let conversation = await Conversation.findOne({
    participants: { $all: [me, other], $size: 2 },
  })

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [me, other],
      lastMessage: '',
      lastMessageAt: new Date(),
    })
  }

  return conversation
}

// GET /api/messages/conversations
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const rows = await Conversation.find({ participants: me })
      .sort({ lastMessageAt: -1 })
      .populate('participants', USER_PUBLIC)
      .exec()

    const conversations = rows.map((row) => {
      const peer = otherParticipant(row, me)
      return {
        _id: String(row._id),
        peer: mapUser(peer),
        lastMessage: row.lastMessage || '',
        lastMessageAt: row.lastMessageAt,
        updatedAt: row.updatedAt,
      }
    })

    res.json({ conversations })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load conversations' })
  }
})

// POST /api/messages/conversations { userId }
router.post('/conversations', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { userId } = req.body

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    if (idsEqual(userId, me)) {
      return res.status(400).json({ message: 'Cannot message yourself' })
    }

    const peerUser = await User.findById(userId).select(USER_PUBLIC)
    if (!peerUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const conversation = await findOrCreateConversation(me, userId)
    const populated = await Conversation.findById(conversation._id)
      .populate('participants', USER_PUBLIC)
      .exec()

    res.json({
      conversation: {
        _id: String(populated._id),
        peer: mapUser(otherParticipant(populated, me)),
        lastMessage: populated.lastMessage || '',
        lastMessageAt: populated.lastMessageAt,
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not open conversation' })
  }
})

// GET /api/messages/conversations/:id
router.get('/conversations/:id', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { id } = req.params
    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ message: 'Invalid conversation id' })
    }

    const conversation = await Conversation.findById(id)
      .populate('participants', USER_PUBLIC)
      .exec()

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    const isMember = conversation.participants.some((p) =>
      idsEqual(p._id, me)
    )
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json({
      conversation: {
        _id: String(conversation._id),
        peer: mapUser(otherParticipant(conversation, me)),
        lastMessage: conversation.lastMessage || '',
        lastMessageAt: conversation.lastMessageAt,
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load conversation' })
  }
})

// GET /api/messages/conversations/:id/messages
router.get('/conversations/:id/messages', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { id } = req.params
    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ message: 'Invalid conversation id' })
    }

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }
    if (!conversation.participants.some((p) => idsEqual(p, me))) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const rows = await Message.find({ conversation: id })
      .sort({ createdAt: 1 })
      .limit(200)
      .populate('sender', USER_PUBLIC)
      .exec()

    res.json({
      messages: rows.map((m) => ({
        _id: String(m._id),
        text: m.text,
        senderId: String(m.sender._id || m.sender),
        sender: mapUser(m.sender),
        createdAt: m.createdAt,
        mine: idsEqual(m.sender._id || m.sender, me),
      })),
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load messages' })
  }
})

// POST /api/messages/conversations/:id/messages { text }
router.post('/conversations/:id/messages', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { id } = req.params
    const text = String(req.body.text || '').trim()

    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ message: 'Invalid conversation id' })
    }
    if (!text) {
      return res.status(400).json({ message: 'Message text is required' })
    }
    if (text.length > 2000) {
      return res.status(400).json({ message: 'Message is too long' })
    }

    const conversation = await Conversation.findById(id).populate(
      'participants',
      USER_PUBLIC
    )
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }
    if (!conversation.participants.some((p) => idsEqual(p._id, me))) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const message = await Message.create({
      conversation: id,
      sender: me,
      text,
    })

    conversation.lastMessage = text
    conversation.lastMessageAt = message.createdAt
    await conversation.save()

    const sender = conversation.participants.find((p) => idsEqual(p._id, me))
    const peer = otherParticipant(conversation, me)
    const peerId = peer ? String(peer._id || peer) : null

    const payload = {
      _id: String(message._id),
      conversationId: String(id),
      text: message.text,
      senderId: String(me),
      sender: mapUser(sender),
      createdAt: message.createdAt,
      mine: false,
    }

    if (peerId) {
      emitToUser(peerId, 'message:new', {
        ...payload,
        conversation: {
          _id: String(conversation._id),
          peer: mapUser(sender),
          lastMessage: text,
          lastMessageAt: message.createdAt,
        },
      })
    }

    res.status(201).json({
      message: {
        ...payload,
        mine: true,
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not send message' })
  }
})

module.exports = router
