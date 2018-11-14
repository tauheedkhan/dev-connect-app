const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function loginValidator (data) {
  let errors = {}

  const password = (!isEmpty(data.password)) ? data.password : ''
  const email = (!isEmpty(data.email)) ? data.email : ''

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
