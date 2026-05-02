const express = require('express')
const emailController = require('../controller/index.js')
const emailValidator = require('../validator/email.validator.js')

const Router = express.Router()

Router.get('/list', emailController.emailList)

Router.post('/insert', emailValidator.insertEmailValidator, emailController.insertEmail)

Router.put('/update/:id', emailValidator.updateEmailValidator, emailController.updateEmail)

Router.delete('/delete/:id', emailValidator.deleteEmailValidator, emailController.deleteEmail)

module.exports = Router