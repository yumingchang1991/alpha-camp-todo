const express = require('express')
const mongoDb = require('./connection.js')
const Todo = require('./models/todo.js')
const { engine } = require('express-handlebars')
const { find } = require('./models/todo.js')
const { urlencoded } = require('express')
const app = express()
const port = 3000

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))

app.route('/')
  .get((req, res) => {
    return Todo
      .find()
      .lean()
      .then( todos => res.render('index', { todos }))
      .catch( error => console.error(error))
  })

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

app.route('/todos/:id/edit')
  .post((req, res) => {
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

app.route('/todos/:id/delete')
  .post((req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .then(todo => todo.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

app.listen(port, () => console.log(`Express is listening on localhost:${port}`))