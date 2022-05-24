const express = require('express')
const { urlencoded } = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const mongoDb = require('./config/mongoose.js')
const Todo = require('./models/todo.js')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000 
// process.env.PORT is provided by Heroku
// if that var does not exist, use port 3000 (local development)

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(PORT, () => console.log(`Express is listening on localhost:${PORT}`))