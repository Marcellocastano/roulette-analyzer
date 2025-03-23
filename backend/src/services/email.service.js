const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.initTransporter();
  }

  async initTransporter() {
    // In ambiente di sviluppo, usa Ethereal Email per i test se non sono configurate credenziali reali
    if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_PASSWORD) {
      // Crea un account di test su Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true per 465, false per altri
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      console.log('Ethereal Email account created for testing:');
      console.log(`- Email: ${testAccount.user}`);
      console.log(`- Password: ${testAccount.pass}`);
      console.log('- View emails at: https://ethereal.email');
    } else {
      const emailService = config.email.service || 'mailgun';
      
      if (emailService.toLowerCase() === 'mailgun') {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.mailgun.org',
          port: 587,
          secure: false,
          auth: {
            user: config.email.user,
            pass: config.email.password
          }
        });
        console.log('Email service configured with Mailgun');
      }
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: config.email.from || `"RoulettePro AI" <${config.email.user}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your Roulette Pro account.</p>
          <p>Please click the button below to reset your password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Regards,<br>The Roulette Pro Team</p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      // Se in ambiente di sviluppo con Ethereal, mostra l'URL per visualizzare l'email
      if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_PASSWORD) {
        console.log('Email anteprima URL: %s', nodemailer.getTestMessageUrl(info));
      } else {
        console.log(`Email inviata a ${user.email}`);
      }
      
      return info;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
