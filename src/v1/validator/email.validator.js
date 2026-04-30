class EmailValidator {

  static checkUuid(id) {
    const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return regexExp.test(id)
  }

  static checkStatus(status) {
    return status === 'active' || status === 'disabled'
  }

  static checkEmail(email) {
    const regexExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexExp.test(email)
  }

  static checkName(name) {
    return name && name.length >= 3 && name.length <= 50
  }

  static insertEmailValidator(req, res, next) {
    const { email, name, status } = req.body

    if (!email || !EmailValidator.checkEmail(email)) {
      return res.status(400).json({ message: 'Email is required!' })
    }

    if (!EmailValidator.checkName(name)) {
      return res.status(400).json({ message: 'Name is required!' })
    }

    if (!status && status != null && status != undefined) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    next()
  }
}

module.exports = EmailValidator