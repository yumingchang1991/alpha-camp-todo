const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  done: Boolean,
})

module.exports = Model('todo', todoSchema)