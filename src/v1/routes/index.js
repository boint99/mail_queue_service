const express = require('express')

const Router = express.Router()

Router.use('/email', require('./email.routes.js'))

Router.use('/email_tasks', require('./email_task.routes.js'))

Router.use('/email_sends', require('./email_send.routes.js'))

module.exports = Router