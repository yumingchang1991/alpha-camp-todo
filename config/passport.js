if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, 
    ( req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            const errorMessage = "this email is not registered!"
            req.errorMessage = errorMessage
            req.flash('loginError', errorMessage)
            return done(null, false, { message: errorMessage })
          }
          return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              const errorMessage = "incorrect password!"
              req.errorMessage = errorMessage
              req.flash('loginError', errorMessage)
              return done(null, false, { message: errorMessage })
            }
            return done(null, user)
          })
          .catch(err => done(err))
        })
      }
    )
  )

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CB_URI,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err))

  })
}
