const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function registrationValidator (data) {
  let errors = {}

  const name = (!isEmpty(data.name)) ? data.name : ''
  const password = (!isEmpty(data.password)) ? data.password : ''
  const email = (!isEmpty(data.email)) ? data.email : ''

  if (!validator.isLength(name, {min: 2, max: 30})) {
    errors.name = 'Name must be between 2 to 30 characters'
  }
  if (!validator.isLength(password, {min: 6, max: 30})) {
    errors.password = 'Password must be between 6 to 30 characters'
  }
  if (!validator.isEmail(email)) {
    errors.email = 'Email is invalid'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
