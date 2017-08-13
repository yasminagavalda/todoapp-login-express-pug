const express = require('express')
const fs = require('fs')
const moment = require('moment')
const router = express.Router()

let taskscompleted = []

router.get('/completed', (req,res) => {
  taskscompleted = []
  process.tasks.forEach(function(item){
    if (item.done === true) {
      taskscompleted.push(item)
    }
  })
  res.render('pages/completed', { taskscompleted })
})

module.exports = router