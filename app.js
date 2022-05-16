const express = require('express')
const mongoDb = require('./connection.js')
const Todo = require('./models/todo.js')
const { engine } = require('express-handlebars')
const { find } = require('./models/todo.js')
const app = express()
const port = 3000

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app
  .route('/')
  .get((req, res) => {
    Todo
      .find()
      .lean()
      .then( todos => res.render('index', { todos }))
      .catch( error => console.error(error))
  })

app.listen(port, () => console.log(`Express is listening on localhost:${port}`))