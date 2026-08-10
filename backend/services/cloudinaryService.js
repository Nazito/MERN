const { v2: cloudinary } = require('cloudinary')
const config = require('config')
const Uuid = require('uuid')

function isCloudinaryConfigured() {
  if (!config.has('cloudinary')) return false
  const c = config.get('cloudinary')
  return Boolean(c && c.cloudName && c.apiKey && c.apiSecret)
}

function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Set cloudinary.cloudName, apiKey, apiSecret in config/local.json'
    )
  }
  const c = config.get('cloudinary')
  cloudinary.config({
    cloud_name: c.cloudName,
    api_key: c.apiKey,
    api_secret: c.apiSecret,
    secure: true,
  })
}

function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
    stream.end(buffer)
  })
}

/**
 * Upload avatar file from express-fileupload.
 * Returns { url, publicId }
 */
async function uploadAvatarFile(file) {
  configureCloudinary()

  const result = await uploadBuffer(file.data, {
    folder: 'circle/avatars',
    public_id: Uuid.v4(),
    overwrite: true,
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

async function deleteAvatarAsset(publicId) {
  if (!publicId) return
  configureCloudinary()
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (e) {
    console.warn('[avatar] Cloudinary destroy failed:', e.message)
  }
}

module.exports = {
  isCloudinaryConfigured,
  uploadAvatarFile,
  deleteAvatarAsset,
}
