import passport from 'passport'
import Auth from '../Auth'

// As far as we store only userId in session
// there is no need to serialize/deserialize user
// With userId we can subscribe to user in router
passport.serializeUser((userId, done) => {
  done(null, userId)
})

passport.deserializeUser((userId, done) => {
  done(null, userId)
})

Auth.prototype._passport = passport

// Auth.prototype.initStrategies = require('./strategies')
