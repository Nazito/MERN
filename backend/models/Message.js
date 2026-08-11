const { Schema, model, ObjectId } = require('mongoose')

const schema = new Schema(
  {
    conversation: { type: ObjectId, ref: 'Conversation', required: true },
    sender: { type: ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
)

schema.index({ conversation: 1, createdAt: 1 })

module.exports = model('Message', schema)
