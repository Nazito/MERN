const { Schema, model, ObjectId } = require('mongoose')

const schema = new Schema(
  {
    requester: { type: ObjectId, ref: 'User', required: true },
    recipient: { type: ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true }
)

schema.index({ requester: 1, recipient: 1 }, { unique: true })
schema.index({ recipient: 1, status: 1 })
schema.index({ requester: 1, status: 1 })

module.exports = model('Friendship', schema)
