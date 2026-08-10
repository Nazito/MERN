/**
 * Seed 10 demo users for local/dev login testing.
 * Usage: node scripts/seedUsers.js
 */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('config')
const User = require('../models/User')
const File = require('../models/File')
const fileService = require('../services/fileService')

const DEMO_PASSWORD = 'password123'

const users = [
  {
    name: 'Maria Koval',
    email: 'maria.koval@circle.test',
    bio: 'Playlists, evening walks, soft light photography.',
  },
  {
    name: 'Ilya Romanov',
    email: 'ilya.romanov@circle.test',
    bio: 'Travel shots and weekend hikes.',
  },
  {
    name: 'Sofia Chen',
    email: 'sofia.chen@circle.test',
    bio: 'Design systems and good coffee.',
  },
  {
    name: 'Alex Petrov',
    email: 'alex.petrov@circle.test',
    bio: 'Frontend engineer. Circle early adopter.',
  },
  {
    name: 'Nina Volkova',
    email: 'nina.volkova@circle.test',
    bio: 'Books, bikes, and city parks.',
  },
  {
    name: 'Dan Miller',
    email: 'dan.miller@circle.test',
    bio: 'Music producer. Always looking for new sounds.',
  },
  {
    name: 'Elena Orlova',
    email: 'elena.orlova@circle.test',
    bio: 'Product manager. Shipping small, often.',
  },
  {
    name: 'Chris Nguyen',
    email: 'chris.nguyen@circle.test',
    bio: 'Climbing walls and side projects.',
  },
  {
    name: 'Anna Belova',
    email: 'anna.belova@circle.test',
    bio: 'Illustrator. Sketching people in cafes.',
  },
  {
    name: 'Max Ivanov',
    email: 'max.ivanov@circle.test',
    bio: 'DevOps by day, board games by night.',
  },
]

async function seed() {
  const mongoUri = config.get('mongoUri')
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12)
  const created = []

  for (const entry of users) {
    let user = await User.findOne({ email: entry.email })

    if (user) {
      user.name = entry.name
      user.bio = entry.bio
      user.password = hashedPassword
      await user.save()
      created.push({ ...entry, status: 'updated' })
    } else {
      user = new User({
        name: entry.name,
        email: entry.email,
        bio: entry.bio,
        password: hashedPassword,
      })
      await user.save()

      try {
        await fileService.createDir(new File({ user: user.id, name: '' }))
      } catch (e) {
        // Directory may already exist from a previous partial run
        console.warn(`file dir for ${entry.email}:`, e.message)
      }

      created.push({ ...entry, status: 'created' })
    }
  }

  console.log('\nSeed complete. Shared password for all:\n')
  console.log(`  ${DEMO_PASSWORD}\n`)
  console.log('Accounts:')
  for (const u of created) {
    console.log(`  ${u.email.padEnd(32)}  ${u.name.padEnd(16)}  [${u.status}]`)
  }
  console.log('')

  await mongoose.disconnect()
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
