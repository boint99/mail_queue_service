const emailSendService = require('../services/emailSend.service')

class emailSendController {

  static async sendEmailsByTaskId(req, res, next) {
    try {
      const { task_id } = req.params
      await emailSendService.sendEmailsByTaskId(task_id, req.body)
      return res.status(200).json({
        status: true,
        message: 'OK'
      })
    } catch (error) {
      next(error)
    }
  }

}

module.exports = emailSendController