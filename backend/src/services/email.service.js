const nodemailer = require('nodemailer');
const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.initMailServices();
  }

  async initMailServices() {
    console.log('Inizializzazione del servizio email...');
    console.log(`Ambiente: ${process.env.NODE_ENV}, Email configurata: ${!!process.env.EMAIL_PASSWORD}`);
    
    // In ambiente di sviluppo, usa Ethereal Email per i test se non sono configurate credenziali reali
    if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_PASSWORD) {
      console.log('Configurazione Ethereal Email per test in sviluppo...');
      try {
        // Crea un account di test su Ethereal
        const testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        
        console.log('Ethereal Email account created for testing:');
        console.log(`- Email: ${testAccount.user}`);
        console.log(`- Password: ${testAccount.pass}`);
        console.log('- View emails at: https://ethereal.email');
        
        this.useEthereal = true;
      } catch (error) {
        console.error('Errore nella configurazione di Ethereal:', error);
        throw error;
      }
    } else {
      console.log('Configurazione Mailgun API...');
      try {
        // Inizializza il client Mailgun per l'API
        const mailgun = new Mailgun(FormData);
        this.mailgunClient = mailgun.client({
          username: 'api',
          key: config.email.password,
          url: 'https://api.eu.mailgun.net/v3' // Usa l'endpoint EU se il tuo dominio è europeo
        });
        
        console.log('Email service configured with Mailgun API');
        console.log(`API Key: ${config.email.password.substring(0, 5)}...`);
        console.log(`Email User: ${config.email.user}`);
        console.log(`Email From: ${config.email.from}`);
        
        this.useEthereal = false;
      } catch (error) {
        console.error('Errore nella configurazione di Mailgun:', error);
        throw error;
      }
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    console.log(`Tentativo di invio email di reset password a: ${user.email}`);
    console.log(`Token di reset (primi 10 caratteri): ${resetToken.substring(0, 10)}...`);
    
    const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;
    console.log(`URL di reset: ${resetUrl}`);
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset for your Roulette Pro account.</p>
        <p>Please click the button below to reset your password. This link is valid for 4 hours.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>Regards,<br>The Roulette Pro Team</p>
      </div>
    `;

    try {
      console.log(`Metodo di invio: ${this.useEthereal ? 'Ethereal (test)' : 'Mailgun API'}`);
      
      if (this.useEthereal) {
        // Usa Ethereal per i test
        console.log('Invio email tramite Ethereal...');
        const mailOptions = {
          from: config.email.from || `"RoulettePro AI" <${config.email.user}>`,
          to: user.email,
          subject: 'Password Reset Request',
          html: emailHtml
        };
        
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Email anteprima URL: %s', nodemailer.getTestMessageUrl(info));
        return info;
      } else {
        // Usa l'API Mailgun
        console.log('Invio email tramite Mailgun API...');
        const domain = config.email.user.split('@')[1]; // Estrae il dominio dall'indirizzo email
        console.log(`Dominio Mailgun: ${domain}`);
        
        try {
          const data = await this.mailgunClient.messages.create(domain, {
            from: config.email.from || `RoulettePro AI <${config.email.user}>`,
            to: [user.email],
            subject: 'Password Reset Request',
            html: emailHtml
          });
          
          console.log(`Email inviata con successo a ${user.email} tramite Mailgun API`);
          console.log('Risposta Mailgun:', JSON.stringify(data));
          return data;
        } catch (mailgunError) {
          console.error('Errore specifico Mailgun:', mailgunError);
          console.error('Dettagli errore:', JSON.stringify(mailgunError, null, 2));
          throw mailgunError;
        }
      }
    } catch (error) {
      console.error('Errore generale nell\'invio dell\'email di reset password:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }
}

module.exports = new EmailService();
