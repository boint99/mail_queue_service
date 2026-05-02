const emailTaskService = require('../services/email_task.service')

class emailTaskController {
  static async emailTaskList(req, res, next) {
    try {
      const result = await emailTaskService.emailTaskList()
      return res.status(200).json({
        status: true,
        message: 'OK',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async emailTaskInsert(req, res, next) {
    try {
      await emailTaskService.emailTaskInsert(req.body)
      return res.status(200).json({
        status: true,
        message: 'OK'
      })
    } catch (error) {
      next(error)
    }
  }

  static async emailTaskUpdate(req, res, next) {
    try {
      const { id } = req.params
      const data = req.body
      await emailTaskService.emailTaskUpdate(id, data)
      return res.status(200).json({
        status: true,
        message: 'OK'
      })
    } catch (error) {
      next(error)
    }
  }

  static async emailTaskDelete(req, res, next) {
    try {
      const { id } = req.params
      await emailTaskService.emailTaskDelete(id)
      return res.status(200).json({
        status: true,
        message: 'OK'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = emailTaskController