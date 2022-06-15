if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')
const mongoDb = require('../../config/mongoose')
const Todo = require('../todo.js')
const User = require('../user.js')

const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

mongoDb.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 10 },
        ( item, index) => Todo.create({ name: `name-${index}`, userId })
      ))
    })
    .then(() => {
      console.log('Seeder completes!')
      process.exit()
    })
})