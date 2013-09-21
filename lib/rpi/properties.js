module.exports = {
  proceed: {
    name: 'proceed',
    message: 'Proceed anyway?',
    default: 'no',
    validator: /^y[es]*|n[o]?$/
  },
  yesno: {
    name: 'yesno',
    message: 'are you sure?',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'no'
  }
};