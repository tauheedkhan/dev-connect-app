const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../../config/keys')
const passport = require('passport')

// Load user model
const User = require('../../models/User')

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'user works'}))

// @route   GET api/users/register
// @desc    Register users
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({email: 'Email already exist'})
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // size
          r: 'pg', // rating
          d: 'mm' // default in cse of no gravatar
        })

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar
        })

        bcrypt.genSalt(10, (err, salt) => {
          if (err) return res.status(500).json({error: err})
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return res.status(500).json({error: err})
            newUser.password = hash
            newUser.save()
              .then(user => res.json(user))
              .catch(err => res.status(500).json({error: err}))
          })
        })
      }
    })
})

// @route   GET api/users/login
// @desc    User login
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // Find user in db
  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(404).json({email: 'User not found'})
      } else {
        // Check password
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              // signed token
              const payload = {name: user.name, email: user.email, id: user.id}

              jwt.sign(payload, secret, { expiresIn: '1h' }, (err, token) => {
                if (err) return res.status(500).json({error: err})
                return res.json({msg: 'Success', token: 'Bearer ' + token})
              })
            } else { return res.status(400).json({password: 'Password incorrect'}) }
          })
      }
    })
})

// @route   GET api/users/current
// @desc    Get current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router
