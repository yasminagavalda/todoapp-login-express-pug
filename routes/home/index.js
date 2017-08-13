const express = require('express')
const fs = require('fs')
const moment = require('moment')
var uniqid = require('uniqid')
const router = express.Router()

let tasksToDo = []

router.get('/home', (req, res) => {
  if (req.session.username && req.session.password) {
    if (process.tasks) {
      tasksToDo = []
      process.tasks.forEach(function(item){
        if (item.done === false) {
          tasksToDo.push(item)
        }
      })
      res.render('pages/home', { tasksToDo, username: req.session.username })
    } else {
      tasksToDo = []
      res.render('pages/home', { tasksToDo, username: req.session.username })
    }
  } else {
    res.redirect('/login')
  }
})

router.post('/home', (req,res) => {
  let todo = {id: uniqid(), name: req.body.task, done: false, dateCreated: 'Created at ' + moment().format('MMMM Do YYYY, h:mm:ss a')}
  process.tasks.push(todo)
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(process.tasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.redirect('/home')
})

router.delete('/home/:id', (req,res) => {
  process.tasks.forEach(function(item, index) {
    if (item.id === req.params.id) {
      process.tasks.splice(index, 1)
      return
    }
  })
  tasksToDo = []
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(process.tasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  process.tasks.forEach(function(item){
    if (item.done === false) {
      tasksToDo.push(item)
    }
  })
  res.render('pages/home', { tasksToDo, username: req.session.username })
})

router.put('/home/:id/:taskname', (req, res) => {
  let id = req.params.id
  let taskname = req.params.taskname
  process.tasks.forEach(function(item) {
    if (item.id === id) {
      item.name = taskname
      return
    }
  })
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(process.tasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.render('pages/home', { tasksToDo, username: req.session.username })
})

router.put('/home/:id', (req, res) => {
  process.tasks.forEach(function(item, index) {
    if (item.id === req.params.id) {
      item.done = true
      item.dateCompleted = 'Completed at ' + moment().format('MMMM Do YYYY, h:mm:ss a')
      return
    }
  })
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(process.tasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.render('pages/home', { tasksToDo, username: req.session.username })
})

router.put('/done-all', (req, res) => {
  process.tasks.forEach(item => {
    item.done = true
    item.dateCompleted = 'Completed at ' + moment().format('MMMM Do YYYY, h:mm:ss a')
  })
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(process.tasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.render('pages/home', { tasksToDo, username: req.session.username })
})

module.exports = router
