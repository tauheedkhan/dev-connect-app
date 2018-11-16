const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function profileValidator (data) {
  let errors = {}

  const handle = (!isEmpty(data.handle)) ? data.handle : ''
  const status = (!isEmpty(data.status)) ? data.status : ''
  const skills = (!isEmpty(data.skills)) ? data.skills : ''

  if (!validator.isLength(handle, {min: 2, max: 40})) {
    errors.handle = 'Handle must be between 2 to 40 characters'
  }
  if (validator.isEmpty(handle)) {
    errors.handle = 'Handle is required'
  }

  if (validator.isEmpty(status)) {
    errors.status = 'Status is required'
  }

  if (validator.isEmpty(skills)) {
    errors.skills = 'skills is required'
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Not a valid url'
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid url'
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid url'
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid url'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
