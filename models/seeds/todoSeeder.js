const mongoDb = require('../../connection.js')
const Todo = require('../todo.js')

mongoDb.once('open', () => {
  for (let i = 0; i < 10; i++) {
    Todo.create({
      name: `test-${i}`
    })
  }
  console.log('todoSeeder done!')
})