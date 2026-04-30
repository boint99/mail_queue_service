const emailService = require('../services')

class emailController {

  static async emailList(req, res, next) {
    try {
      const result = await emailService.emailList()
      return res.status(200).json({
        status: true,
        message: 'OK',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async insertEmail(req, res, next) {
    try {
      await emailService.insertEmail(req.body)
      return res.status(200).json({
        status: true,
        message: 'OK',
        data: []
      })
    } catch (error) {
      next(error)
    }
  }

}

module.exports = emailController