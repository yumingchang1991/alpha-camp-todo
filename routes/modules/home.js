const router = require('express').Router()
const Todo = require('../../models/todo')

router.route('/').get((req, res) => {
  const userId = req.user._id
  return Todo
    .find({ userId })
    .sort({ _id: 'asc' })
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

module.exports = router