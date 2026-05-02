const MODEL = require('../model')

class emailTaskModel extends MODEL {
  constructor() {
    super('email_tasks')
  }
  async emailTaskList() {
    return await this.FINDALL()
  }

  async findById(id) {
    return await this.FINDBYID(id)
  }

  async findbyUnique(column, value) {
    return await this.FINDBYUNIQUE(column, value)
  }

  async emailTaskInsert(data) {
    return await this.CREATE(data)
  }

  async emailTaskUpdate(id, data) {
    return await this.UPDATE(id, data)
  }

  async emailTaskDelete(id) {
    return await this.DELETE(id)
  }
}

module.exports = new emailTaskModel()