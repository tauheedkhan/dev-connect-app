const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function experienceValidator (data) {
  let errors = {}

  const title = (!isEmpty(data.title)) ? data.title : ''
  const company = (!isEmpty(data.company)) ? data.company : ''
  const from = (!isEmpty(data.from)) ? data.from : ''

  if (validator.isEmpty(title)) {
    errors.title = 'Job title is required'
  }

  if (validator.isEmpty(company)) {
    errors.company = 'Company is required'
  }

  if (validator.isEmpty(from)) {
    errors.from = 'From date is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
