require('dotenv').config()
const express = require('express')
const session = require('express-session')
const { urlencoded } = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const mongoDb = require('./config/mongoose.js')
const Todo = require('./models/todo.js')
const routes = require('./routes')

const usePassport = require('./config/passport')

const app = express()
const PORT = process.env.PORT || 3000 
// process.env.PORT is provided by Heroku
// if that var does not exist, use port 3000 (local development)

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => console.log(`Express is listening on localhost:${PORT}`))