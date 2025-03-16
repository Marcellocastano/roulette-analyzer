const { contactRepository } = require('../repositories');

class ContactService {
  async addFeedback(userId, category, message) {
    return await contactRepository.addFeedback(userId, category, message);
  }
}

module.exports = ContactService;
