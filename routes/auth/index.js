const express = require('express')
const fs = require('fs')
const router = express.Router()

router.get('/', (req, res) => {
  if (req.session.username && req.session.password) {
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

router.get('/login', (req, res) => {
  if (req.session.username && req.session.password) {
    res.redirect('/home')
  } else {
    res.render('pages/login')
  }
})

router.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const users = fs.readFileSync('data/users.txt', 'utf-8').split('\r\n')
  const loginOk = users.some(function (item) {
    return item === username + ':' + password
  })
  if (loginOk) {
    req.session.username = username
    req.session.password = password
    res.redirect('/home')
  } else {
    res.redirect('/error')
  }
})

router.get('/error', (req, res) => {
  res.render('pages/error')
})

router.get('/logout', (req, res) => {
  req.session.username = null
  req.session.password = null
  res.redirect('/login')
})

router.get('/register', (req, res) => {
  res.render('pages/register')
})

router.post('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const user = '\r\n' + username + ':' + password
  fs.appendFileSync('data/users.txt', user)
  res.redirect('/login')
})

module.exports = router