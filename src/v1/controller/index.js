const emailService = require('../services')

class emailController {

  static async emailList(req, res) {
    res.json({
      message: 'OK',
      data: []
    })
  }

  static async insertEmail(req, res) {
    await emailService.insertEmail(req.body)
    res.json({
      message: 'OK'
    })
  }

}

module.exports = emailController