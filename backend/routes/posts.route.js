const { Router } = require('express')
const ObjectID = require('mongodb').ObjectID
const authMiddleware = require('../middleware/auth.middleware')
const Post = require('../models/Post')
const { acceptedFriendsFor, idsEqual } = require('../services/friendsService')

const router = Router()
const USER_PUBLIC = 'name avatar'
const FEED_LIMIT = 50

function mapPost(doc, meId) {
  const author = doc.author
  const likes = doc.likes || []
  return {
    _id: String(doc._id),
    text: doc.text,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    author: author
      ? {
          _id: String(author._id || author),
          name: author.name,
          avatar: author.avatar,
        }
      : null,
    likesCount: likes.length,
    likedByMe: likes.some((id) => idsEqual(id._id || id, meId)),
    isMine: author ? idsEqual(author._id || author, meId) : false,
  }
}

// GET /api/posts — feed (me + friends)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const friends = await acceptedFriendsFor(me)
    const authorIds = [me, ...friends.map((f) => f._id)]

    const rows = await Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .limit(FEED_LIMIT)
      .populate('author', USER_PUBLIC)
      .exec()

    res.json({ posts: rows.map((row) => mapPost(row, me)) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load feed' })
  }
})

// GET /api/posts/user/:userId — profile wall
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { userId } = req.params

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }

    const rows = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(FEED_LIMIT)
      .populate('author', USER_PUBLIC)
      .exec()

    res.json({ posts: rows.map((row) => mapPost(row, me)) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not load posts' })
  }
})

// POST /api/posts
router.post('/', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const text = String(req.body.text || '').trim()

    if (!text) {
      return res.status(400).json({ message: 'Post text is required' })
    }
    if (text.length > 2000) {
      return res.status(400).json({ message: 'Post is too long' })
    }

    const created = await Post.create({ author: me, text, likes: [] })
    const post = await Post.findById(created._id)
      .populate('author', USER_PUBLIC)
      .exec()

    res.status(201).json({ post: mapPost(post, me) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not create post' })
  }
})

// PATCH /api/posts/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { id } = req.params
    const text = String(req.body.text || '').trim()

    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }
    if (!text) {
      return res.status(400).json({ message: 'Post text is required' })
    }
    if (text.length > 2000) {
      return res.status(400).json({ message: 'Post is too long' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (!idsEqual(post.author, me)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    post.text = text
    await post.save()
    await post.populate('author', USER_PUBLIC).execPopulate()

    res.json({ post: mapPost(post, me) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not update post' })
  }
})

// DELETE /api/posts/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { id } = req.params

    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (!idsEqual(post.author, me)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await post.remove()
    res.json({ message: 'Post deleted', _id: id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not delete post' })
  }
})

// POST /api/posts/:id/like — toggle
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const me = req.user.userId
    const { id } = req.params

    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const idx = (post.likes || []).findIndex((uid) => idsEqual(uid, me))
    if (idx >= 0) {
      post.likes.splice(idx, 1)
    } else {
      post.likes.push(me)
    }
    await post.save()
    await post.populate('author', USER_PUBLIC).execPopulate()

    res.json({ post: mapPost(post, me) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not update like' })
  }
})

module.exports = router
