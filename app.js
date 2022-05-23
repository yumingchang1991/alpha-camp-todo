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

app.route('/todos')
  .post((req, res) => {
    return Todo.create({
      name: req.body.name
    })
      .then(() => res.redirect('/'))
      .catch(error => console.error(error))
  })

app.route('/todos/new')
  .get((req, res) => {
    return res.render('new')
  })

app.route('/todos/:id')
  .get((req, res) => {
    return Todo.findById(req.params.id)
      .lean()  
      .then(todo => res.render('detail', { todo }))
      .catch(error => console.error(error))
  })

app.route('/todos/:id/edit')
  .get((req, res) => {
    return Todo.findById(req.params.id)
      .lean()
      .then(todo => res.render('edit', { todo }))
      .catch(error => console.error(error))
  })

app.route('/todos/:id')
  .put((req, res) => {
    const id = req.params.id
    const { name, isDone } = req.body
    return Todo.findById(id)
      .then((todo) => {
        todo.name = name
        todo.isDone = isDone === 'on'
        return todo.save()
      })
      .then(() => res.redirect(`/todos/${id}`))
      .catch((error) => console.error(error))
  })

app.route('/todos/:id')
  .delete((req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .then(todo => todo.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

app.listen(port, () => console.log(`Express is listening on localhost:${port}`))