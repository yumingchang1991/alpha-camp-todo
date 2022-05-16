const express = require('express')
const mongoDb = require('./connection.js')
const todoSchema = require('./models/todo.js')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app
  .route('/')
  .get((req, res) => res.send('Express is live'))

app.listen(port, () => console.log(`Express is listening on localhost:${port}`))