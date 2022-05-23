const express = require('express')
const { urlencoded } = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const mongoDb = require('./connection.js')
const Todo = require('./models/todo.js')
const routes = require('./routes')

const app = express()
const port = 3000

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, () => console.log(`Express is listening on localhost:${port}`))