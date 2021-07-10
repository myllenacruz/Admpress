const express = require('express')
const router = express.Router()
const User = require('./User')

router.get('/admin/users', (req, res) => {
  res.send('Usuários:')
})

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  res.json({ email, password })
})

module.exports = router
