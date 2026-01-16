const { contactRepository, userRepository } = require('../repositories');
const emailService = require('./email.service');

class ContactService {
  async addFeedback(userId, category, message) {
    const feedback = await contactRepository.addFeedback(userId, category, message);

    // Invia notifica di contatto all'amministratore
    try {
      const user = await userRepository.findById(userId);
      if (user) {
        await emailService.sendContactNotificationToAdmin(user, category, message);
      }
    } catch (notificationError) {
      console.error('Error sending contact notification to admin:', notificationError);
      // Non bloccare il feedback se la notifica fallisce
    }

    return feedback;
  }
}

module.exports = ContactService;
