const { Schema, model, ObjectId } = require('mongoose')

const schema = new Schema(
  {
    participants: [{ type: ObjectId, ref: 'User', required: true }],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

schema.index({ participants: 1 })
schema.index({ lastMessageAt: -1 })

module.exports = model('Conversation', schema)
