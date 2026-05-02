const express = require('express')
const emaiTaskController = require('../controller/email_task.controller')

const Router = express.Router()

Router.get('/campaign/list', emaiTaskController.emailTaskList)

Router.post('/campaign/insert', emaiTaskController.emailTaskInsert)

Router.put('/campaign/update/:id', emaiTaskController.emailTaskUpdate)

Router.delete('/campaign/delete/:id', emaiTaskController.emailTaskDelete)

module.exports = Router