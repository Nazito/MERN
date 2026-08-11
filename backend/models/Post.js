const { Schema, model, ObjectId } = require('mongoose')

const schema = new Schema(
  {
    author: { type: ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    likes: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

schema.index({ createdAt: -1 })
schema.index({ author: 1, createdAt: -1 })

module.exports = model('Post', schema)
