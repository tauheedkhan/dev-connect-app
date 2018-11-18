const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function educationValidator (data) {
  let errors = {}

  const school = (!isEmpty(data.school)) ? data.school : ''
  const degree = (!isEmpty(data.degree)) ? data.degree : ''
  const fieldofstudy = (!isEmpty(data.from)) ? data.from : ''
  const from = (!isEmpty(data.from)) ? data.from : ''

  if (validator.isEmpty(school)) {
    errors.school = 'School is required'
  }

  if (validator.isEmpty(degree)) {
    errors.degree = 'Degree is required'
  }

  if (validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = 'Fieldofstudy is required'
  }

  if (validator.isEmpty(from)) {
    errors.from = 'From date is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
