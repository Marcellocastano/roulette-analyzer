const { ContactService } = require('../services');

class ContactController {
  constructor() {
    this.contactService = new ContactService();
  }

  addFeedback = async (req, res, next) => {
    try {
      const { category, message } = req.body;
      
      // Validazione input
      if (!category || !message) {
        return res.status(400).json({
          status: 'error',
          message: 'Category and message are required'
        });
      }
      
      // Validazione categoria (deve essere uno dei valori consentiti)
      const allowedCategories = ['bug_report', 'payment_issue', 'feature_request', 'general_inquiry', 'other'];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid category'
        });
      }
      
      // Validazione lunghezza messaggio
      if (message.length < 5 || message.length > 1000) {
        return res.status(400).json({
          status: 'error',
          message: 'Message must be between 5 and 1000 characters'
        });
      }
      
      // Sanitizzazione del messaggio (rimuove tag HTML e caratteri potenzialmente pericolosi)
      const sanitizedMessage = message
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
      
      const stats = await this.contactService.addFeedback(req.user.id, category, sanitizedMessage);
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ContactController;
