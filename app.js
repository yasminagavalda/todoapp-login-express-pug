const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const cookieSession = require('cookie-session')
const moment = require('moment')
var uniqid = require('uniqid')
var readDir = require('readdir')

const app = express()
const PORT = 3002

app.set('view engine', 'pug')

app.use(cookieSession({
  name: 'myCookieName',
  keys: ['holaquetal']
}))

app.use((req, res, next) => {
  req.session.username = req.session.username || null
  req.session.password = req.session.password || null
  next()
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let username = ''
let todoTasks = []
let tasks = []
let taskscompleted = []

app.get('/', (req, res) => {
  if (req.session.username && req.session.password) {
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res) => {
  if (req.session.username && req.session.password) {
    res.redirect('/home')
  } else {
    res.render('pages/login')
  }
})

app.post('/login', (req, res) => {
  username = req.body.username
  let password = req.body.password
  let loginOk = 0
  const users = fs.readFileSync('data/users.txt', 'utf-8').split('\r\n')
  users.forEach(function (item) {
    let user = item.split(':')
    if (username === user[0] && password === user[1]) {
      loginOk = 1
      req.session.username = username
      req.session.password = password
    }
  })
  if (loginOk === 1) {
    res.redirect('/home')
  } else {
    res.redirect('/error')
  }
})


app.get('/error', (req, res) => {
  res.render('pages/error', {username})
})

app.get('/logout', (req, res) => {
  req.session.username = null
  req.session.password = null
  res.redirect('/login')
})

app.get('/register', (req, res) => {
  res.render('pages/register')
})

app.post('/register', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let user = '\r\n' + username + ':' + password
  fs.appendFileSync('users.txt', user)
  res.redirect('/login')
})

app.get('/home', (req, res) => {
  if (req.session.username && req.session.password) {
    let files = fs.readdirSync('data/tasks')
    let jsonExists = files.some(item => {
      return item === req.session.username + '.json'
    })
    if (jsonExists) {
      todoTasks = JSON.parse(fs.readFileSync('data/tasks/' + req.session.username + '.json', 'utf-8'))
      tasks = []
      todoTasks.forEach(function(item){
        if (item.done === false) {
          tasks.push(item)
        }
      })
      res.render('pages/home', { tasks, username: req.session.username })
    } else {
      fs.writeFile('data/tasks/' + req.session.username + '.json', '[{"id":"", "done": true}]', err => {
        if(err) throw err
        console.log("The file was saved!")
      })
      res.render('pages/home', { tasks, username: req.session.username })
    }
  } else {
    res.redirect('/login')
  }
})

app.get('/completed', (req,res) => {
  taskscompleted = []
  todoTasks.forEach(function(item){
    if (item.done === true) {
      taskscompleted.push(item)
    }
  })
  res.render('pages/completed', { taskscompleted })
})

app.post('/home', (req,res) => {
  let todo = {id: uniqid(), name: req.body.task, done: false, dateCreated: 'Created at ' + moment().format('MMMM Do YYYY, h:mm:ss a')}
  todoTasks.push(todo)
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(todoTasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })

  res.redirect('/home')
})

app.delete('/task/:id', (req,res) => {
  todoTasks.forEach(function(item, index) {
  	if (item.id === req.params.id) {
  		todoTasks.splice(index, 1)
      return
    }
  })
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(todoTasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.render('pages/home', { tasks })
})

app.put('/completed/:id', (req, res) => {
  todoTasks.forEach(function(item, index) {
  	if (item.id === req.params.id) {
  		item.done = true
      item.dateCompleted = 'Completed at ' + moment().format('MMMM Do YYYY, h:mm:ss a')
  		return
  	}
  })
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(todoTasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.render('pages/home', { tasks })
})

app.put('/done-all', (req, res) => {
  todoTasks.forEach(item => {
    item.done = true
    item.dateCompleted = 'Completed at ' + moment().format('MMMM Do YYYY, h:mm:ss a')
  })
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(todoTasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.render('pages/home', { tasks })
})


app.put('/edited/:id/:taskname', (req, res) => {
  let id = req.params.id
  let taskname = req.params.taskname
  todoTasks.forEach(function(item) {
    if (item.id === id) {
      item.name = taskname
      console.log(item.name)
      return
    }
  })
  fs.writeFile('data/tasks/' + req.session.username + '.json', JSON.stringify(todoTasks), err => {
    if(err) throw err
    console.log("The file was saved!")
  })
  res.render('pages/home', { tasks })
})

app.listen(PORT)
console.log(`Listening on PORT ${PORT}`)


