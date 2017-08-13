const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const cookieSession = require('cookie-session')
const moment = require('moment')
var uniqid = require('uniqid')

const app = express()
const PORT = 3002

const routesAuth = require('./routes/auth/')
const routesHome = require('./routes/home/')
const routesCompleted = require('./routes/completed/')

app.use(cookieSession({
  name: 'myCookieName',
  keys: ['holaquetal']
}))



app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'pug')

app.use((req, res, next) => {
  req.session.username = req.session.username || null
  req.session.password = req.session.password || null
  next()
})

app.use((req, res, next) => {
  let { username, dataLoaded } = req.session
  if (username) {
    const pathTasks = path.join(process.cwd(), `data/tasks/${username}.json`)
    if (fs.existsSync(pathTasks)) {
      process.tasks = require(pathTasks)
    } else {
      process.tasks = []
    }
  }
  next()
})

app.use(routesAuth)
app.use(routesHome)
app.use(routesCompleted)

app.listen(PORT)
console.log(`Listening on PORT ${PORT}`)
