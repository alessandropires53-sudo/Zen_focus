require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const webpush = require('web-push')

const app = express()
app.use(cors())
app.use(express.json())

// 🔐 Usuário fake temporário (depois colocamos banco)
const user = {
  id: 1,
  email: 'admin@zen.com',
  password: bcrypt.hashSync('123456', 8)
}

// 🔐 Login
app.post('/login', (req, res) => {
  const { email, password } = req.body

  if (email !== user.email)
    return res.status(404).json({ message: 'Usuário não encontrado' })

  const passwordIsValid = bcrypt.compareSync(password, user.password)
  if (!passwordIsValid)
    return res.status(401).json({ token: null, message: 'Senha inválida' })

  const token = jwt.sign({ id: user.id }, 'segredo_super_forte', {
    expiresIn: 86400
  })

  res.json({ auth: true, token })
})

// 🚀 Iniciar servidor
app.listen(5000, () => {
  console.log('🔥 Backend rodando na porta 5000')
})