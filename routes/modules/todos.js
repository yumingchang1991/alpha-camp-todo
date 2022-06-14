const router = require('express').Router()
const Todo = require('../../models/todo')

router.route('/')
  .post((req, res) => {
    return Todo.create({
      name: req.body.name,
      userId: req.user._id
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
    const userId = req.user._id
    return Todo.findOne({ 
      userId,
      _id: req.params.id
     })
      .lean()
      .then(todo => res.render('detail', { todo }))
      .catch(error => console.error(error))
  })

router.route('/:id/edit')
  .get((req, res) => {
    const userId = req.user._id
    return Todo.findOne({
      userId,
      _id: req.params.id
    })
      .lean()
      .then(todo => res.render('edit', { todo }))
      .catch(error => console.error(error))
  })

router.route('/:id')
  .put((req, res) => {
    const _id = req.params.id
    const userId = req.user._id
    const { name, isDone } = req.body
    return Todo.findOne({ _id, userId })
      .then((todo) => {
        todo.name = name
        todo.isDone = isDone === 'on'
        return todo.save()
      })
      .then(() => res.redirect(`/todos/${_id}`))
      .catch((error) => console.error(error))
  })

router.route('/:id')
  .delete((req, res) => {
    const _id = req.params.id
    const userId = req.user._id
    return Todo.findOne({ _id, userId })
      .then(todo => todo.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

module.exports = router