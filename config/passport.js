const {Strategy, ExtractJwt} = require('passport-jwt')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const {secret} = require('./keys')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secret

module.exports = passport => {
  passport.use(new Strategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      })
      .catch(err => console.log('Error: ', err))
  }))
}
