const Friendship = require('../models/Friendship')

const USER_PUBLIC = 'name avatar bio email'

function idsEqual(a, b) {
  return String(a) === String(b)
}

async function findBetween(userA, userB) {
  return Friendship.findOne({
    $or: [
      { requester: userA, recipient: userB },
      { requester: userB, recipient: userA },
    ],
  })
}

function friendshipStatus(doc, meId) {
  if (!doc) return 'none'
  if (doc.status === 'accepted') return 'friends'
  if (idsEqual(doc.requester, meId)) return 'pending_sent'
  return 'pending_received'
}

function mapFriendUser(user) {
  if (!user) return null
  return {
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    email: user.email,
  }
}

async function acceptedFriendsFor(userId) {
  const rows = await Friendship.find({
    status: 'accepted',
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate('requester', USER_PUBLIC)
    .populate('recipient', USER_PUBLIC)
    .exec()

  return rows
    .map((row) => {
      const other = idsEqual(row.requester._id, userId)
        ? row.recipient
        : row.requester
      return mapFriendUser(other)
    })
    .filter(Boolean)
}

async function friendsCountFor(userId) {
  return Friendship.countDocuments({
    status: 'accepted',
    $or: [{ requester: userId }, { recipient: userId }],
  })
}

module.exports = {
  USER_PUBLIC,
  idsEqual,
  findBetween,
  friendshipStatus,
  mapFriendUser,
  acceptedFriendsFor,
  friendsCountFor,
}
