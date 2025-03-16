const BaseRepository = require('./base.repository');
const { Contact } = require('../models');

class ContactRepository extends BaseRepository {
  constructor() {
    super(Contact);
  }

  async addFeedback(userId, category, message) {
    return await this.create({
      foreignUserId: userId,
      category,
      message
    });
  }
}

module.exports = new ContactRepository();
