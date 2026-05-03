const express = require('express')
const emailSendController = require('../controller/email_send.controller')

const Router = express.Router()

Router.post('/email_tasks/:task_id/send_emails', emailSendController.sendEmailsByTaskId)


module.exports = Router