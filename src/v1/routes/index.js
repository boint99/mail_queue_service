const express = require('express')
const emailController = require('../controller/index.js')
const emailValidator = require('../validator/email.validator.js')

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.send('OK')
})
Router.get('/email/list', emailController.emailList)

Router.post('/email/insert_email', emailValidator.insertEmailValidator, emailController.insertEmail)

module.exports = Router