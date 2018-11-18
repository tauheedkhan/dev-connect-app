const express = require('express')
const router = express.Router()
const passport = require('passport')
const profileValidator = require('../../validators/profile')
const experienceValidator = require('../../validators/experience')
const educationValidator = require('../../validators/education')

// Load profile model
const Profile = require('../../models/Profile')

// Load User model
const User = require('../../models/User')

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {}

  Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(500).json(err))
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (profiles.length === 0) {
        res.status(404).json({noprofile: 'No profiles found'})
      }
      res.json(profiles)
    })
    .catch(error => res.status(500).json({error: error}))
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', (req, res) => {
  Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        res.status(404).json({noprofile: 'No profile found'})
      }
      res.json(profile)
    })
    .catch(error => res.status(500).json({error: error}))
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        res.status(404).json({noprofile: 'No profile found'})
      }
      res.json(profile)
    })
    .catch(error => res.status(500).json({error: error}))
})

// @route   POST api/profile
// @desc    Create/Update user profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = profileValidator(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  // Get feilds
  const profileFields = {}
  profileFields.user = req.user.id
  if (req.body.handle) profileFields.handle = req.body.handle
  if (req.body.company) profileFields.company = req.body.company
  if (req.body.website) profileFields.website = req.body.website
  if (req.body.loaction) profileFields.loaction = req.body.loaction
  if (req.body.bio) profileFields.bio = req.body.bio
  if (req.body.status) profileFields.status = req.body.status
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername
  if (typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',')
  profileFields.social = {}
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram

  Profile.findOne({user: req.user.id})
    .then(profile => {
      if (profile) {
        // update
        Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
          .then(profile => {
            return res.json(profile)
          })
      }
      // Create

      // Check handle
      Profile.findOne({handle: profileFields.handle})
        .then(profile => {
          if (profile) {
            errors.handle = 'That handle already exist'
            res.status(400).json(errors)
          }
          // Save profile
          new Profile(profileFields).save().then(profile => res.json(profile))
        })
    })
})

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = experienceValidator(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      profile.experience.unshift(newExp)
      profile.save().then(profile => res.json(profile))
    })
})

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = educationValidator(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      profile.education.unshift(newEdu)
      profile.save().then(profile => res.json(profile))
    })
})

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

      // remove from experience
      profile.experience.splice(removeIndex, 1)

      // save
      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(500).json(err))
})

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

      // remove from experience
      profile.education.splice(removeIndex, 1)

      // save
      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(500).json(err))
})

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndRemove({user: req.user.id})
    .then(() => {
      User.findOneAndRemove({_id: req.user.id})
        .then(() => res.json({success: true}))
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router
