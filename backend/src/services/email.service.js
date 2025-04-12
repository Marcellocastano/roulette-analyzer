const nodemailer = require('nodemailer');
const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = null;
    this.mailgunClient = null;
    this.useEthereal = false;
    this.isInitialized = false;
    this.initPromise = this.initMailServices();
  }

  async initMailServices() {
    console.log('Inizializzazione del servizio email...');
    console.log(`Ambiente: ${process.env.NODE_ENV}, Email configurata: ${!!process.env.EMAIL_PASSWORD}`);
    
    // In ambiente di sviluppo, usa sempre Ethereal Email per i test
    if (process.env.NODE_ENV !== 'production') {
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
        
        // Usa l'endpoint EU se il dominio è europeo
        const apiUrl = 'https://api.eu.mailgun.net'; // Cambiato da v3 a base URL
        
        this.mailgunClient = mailgun.client({
          username: 'api',
          key: config.email.password,
          url: apiUrl
        });
        
        console.log('Email service configured with Mailgun API');
        console.log(`API Key: ${config.email.password.substring(0, 5)}...`);
        console.log(`Email User: ${config.email.user}`);
        console.log(`Email From: ${config.email.from}`);
        console.log(`API URL: ${apiUrl}`);
        
        this.useEthereal = false;
      } catch (error) {
        console.error('Errore nella configurazione di Mailgun:', error);
        throw error;
      }
    }
    
    this.isInitialized = true;
  }

  // Metodo helper per assicurarsi che il servizio sia inizializzato
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initPromise;
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    await this.ensureInitialized();
    console.log(`Tentativo di invio email di reset password a: ${user.email}`);
    
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
        const domain = 'roulettepro.ai'; // Usa direttamente il dominio invece di estrarlo dall'email
        
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
          
          // Prova con un approccio alternativo se il primo fallisce
          if (mailgunError.status === 405) {
            console.log('Tentativo alternativo con endpoint diverso...');
            try {
              // Usa il metodo send invece di create
              const altData = await this.mailgunClient.messages.send(domain, {
                from: config.email.from || `RoulettePro AI <${config.email.user}>`,
                to: [user.email],
                subject: 'Password Reset Request',
                html: emailHtml
              });
              
              console.log(`Email inviata con successo (metodo alternativo) a ${user.email}`);
              console.log('Risposta Mailgun (alternativa):', JSON.stringify(altData));
              return altData;
            } catch (altError) {
              console.error('Anche il tentativo alternativo è fallito:', altError);
              throw altError;
            }
          }
          
          throw mailgunError;
        }
      }
    } catch (error) {
      console.error('Errore generale nell\'invio dell\'email di reset password:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  async sendConfirmationEmail(user, token) {
    await this.ensureInitialized();
    try {
      console.log(`Tentativo di invio email di conferma a: ${user.email}`);
      
      const confirmUrl = `${config.frontendUrl}/confirm-email/${token}`;
      console.log(`URL di conferma: ${confirmUrl}`);
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Conferma il tuo indirizzo email</h2>
          <p>Ciao ${user.name},</p>
          <p>Grazie per esserti registrato a Roulette Pro AI. Per completare la registrazione, conferma il tuo indirizzo email.</p>
          <p>Clicca sul pulsante qui sotto per confermare il tuo indirizzo email. Questo link è valido per 24 ore.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Conferma Email
            </a>
          </div>
          <p>Se non hai richiesto questa email, puoi ignorarla.</p>
          <p>Cordiali saluti,<br>Il Team di Roulette Pro AI</p>
        </div>
      `;
      
      console.log(`Metodo di invio: ${this.useEthereal ? 'Ethereal (test mode)' : 'Mailgun API'}`);
      
      if (this.useEthereal) {
        console.log('Invio email tramite Ethereal (test mode)...');
        const mailOptions = {
          from: config.email.from || `"RoulettePro AI" <${config.email.user}>`,
          to: user.email,
          subject: 'Conferma il tuo indirizzo email - RoulettePro AI',
          html: emailHtml
        };
        
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Email anteprima URL: %s', nodemailer.getTestMessageUrl(info));
        return info;
      } else {
        console.log('Invio email tramite Mailgun API...');
        const data = {
          from: config.email.from || `RoulettePro AI <${config.email.user}>`,
          to: user.email,
          subject: 'Conferma il tuo indirizzo email - RoulettePro AI',
          html: emailHtml
        };
        
        const result = await this.mailgunClient.messages.create(config.email.domain, data);
        console.log('Email inviata tramite Mailgun:', result);
        return result;
      }
    } catch (error) {
      console.error('Errore generale nell\'invio dell\'email di conferma:', error);
      console.error('Stack trace:', error.stack);
      
      // In ambiente di sviluppo, mostra il token di conferma nei log
      if (process.env.NODE_ENV !== 'production') {
        console.log('=========================================');
        console.log(`Confirmation token for ${user.email}: ${token}`);
        console.log(`Confirmation URL: ${config.frontendUrl}/confirm-email/${token}`);
        console.log('=========================================');
      }
      
      throw error;
    }
  }
}

module.exports = new EmailService();
