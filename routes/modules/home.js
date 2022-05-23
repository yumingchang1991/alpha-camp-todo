const router = require('express').Router()
const Todo = require('../../models/todo')

router.route('/').get((req, res) => {
  return Todo
    .find()
    .sort({ _id: 'asc' })
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

module.exports = router