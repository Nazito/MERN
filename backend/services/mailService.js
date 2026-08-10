const nodemailer = require('nodemailer')
const config = require('config')

function getMailConfig() {
  if (!config.has('mail')) return null
  const mail = config.get('mail')
  if (!mail || !mail.host || !mail.user || !mail.pass) return null
  return mail
}

async function sendMail({ to, subject, text, html }) {
  const mail = getMailConfig()

  if (!mail) {
    console.warn('[mail] SMTP not configured — message logged only:')
    console.warn({ to, subject, text })
    return { logged: true }
  }

  const transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port || 587,
    secure: Boolean(mail.secure),
    auth: {
      user: mail.user,
      pass: mail.pass,
    },
  })

  await transporter.sendMail({
    from: mail.from || mail.user,
    to,
    subject,
    text,
    html,
  })

  return { sent: true }
}

module.exports = { sendMail, getMailConfig }
