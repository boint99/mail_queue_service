const MODEL = require('../model')

class EmailModel extends MODEL {
  constructor() {
    super('emails')
  }
  async emailList() {
    return await this.FINDALL()
  }

  async findById(id) {
    return await this.FINDBYID(id)
  }

  async findbyUnique(column, value) {
    return await this.FINDBYUNIQUE(column, value)
  }

  async insertEmail(data) {
    return await this.CREATE(data)
  }

  async updateEmail(id, data) {
    return await this.UPDATE(id, data)
  }

  async deleteEmail(id) {
    return await this.DELETE(id)
  }
}

module.exports = new EmailModel()