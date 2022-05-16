const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => console.log(`mongoDb error`))
db.once('open', () => console.log(`mongoDb connected`))

module.exports = db