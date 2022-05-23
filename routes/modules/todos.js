const router = require('express').Router()
const Todo = require('../../models/todo')

router.route('/')
  .post((req, res) => {
    return Todo.create({
      name: req.body.name
    })
      .then(() => res.redirect('/'))
      .catch(error => console.error(error))
  })

router.route('/new')
  .get((req, res) => {
    return res.render('new')
  })

router.route('/:id')
  .get((req, res) => {
    return Todo.findById(req.params.id)
      .lean()
      .then(todo => res.render('detail', { todo }))
      .catch(error => console.error(error))
  })

router.route('/:id/edit')
  .get((req, res) => {
    return Todo.findById(req.params.id)
      .lean()
      .then(todo => res.render('edit', { todo }))
      .catch(error => console.error(error))
  })

router.route('/:id')
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

router.route('/:id')
  .delete((req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .then(todo => todo.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

module.exports = router