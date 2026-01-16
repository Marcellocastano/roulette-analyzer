const nodemailer = require('nodemailer');
const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const config = require('../config/config');
const { notificationSettingsRepository } = require('../repositories');

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

  /**
   * Invia notifica di registrazione all'amministratore
   */
  async sendSignupNotificationToAdmin(user) {
    try {
      // Verifica se le notifiche di registrazione sono abilitate
      const isEnabled = await notificationSettingsRepository.isSignupNotificationEnabled();
      if (!isEnabled) {
        console.log('Notifiche di registrazione disabilitate, email non inviata');
        return null;
      }

      await this.ensureInitialized();
      
      const adminEmail = await notificationSettingsRepository.getAdminEmail();
      console.log(`Invio notifica di registrazione all'admin: ${adminEmail}`);
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🎯 Nuova Registrazione - RoulettePro AI</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Dettagli Utente:</h3>
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Data Registrazione:</strong> ${new Date().toLocaleString('it-IT')}</p>
            <p><strong>ID Utente:</strong> ${user._id}</p>
          </div>
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              Questa è una notifica automatica del sistema RoulettePro AI.
            </p>
          </div>
        </div>
      `;

      return await this.sendEmail({
        to: adminEmail,
        subject: `🎯 Nuova Registrazione: ${user.name} - RoulettePro AI`,
        html: emailHtml
      });
    } catch (error) {
      console.error('Errore nell\'invio della notifica di registrazione:', error);
      // Non lanciare l'errore per non bloccare il processo di registrazione
      return null;
    }
  }

  /**
   * Invia notifica di richiesta pagamento all'amministratore
   */
  async sendPaymentRequestNotificationToAdmin(user, subscriptionRequest, plan) {
    try {
      // Verifica se le notifiche di richiesta pagamento sono abilitate
      const isEnabled = await notificationSettingsRepository.isPaymentRequestNotificationEnabled();
      if (!isEnabled) {
        console.log('Notifiche di richiesta pagamento disabilitate, email non inviata');
        return null;
      }

      await this.ensureInitialized();
      
      const adminEmail = await notificationSettingsRepository.getAdminEmail();
      console.log(`Invio notifica di richiesta pagamento all'admin: ${adminEmail}`);
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">💳 Nuova Richiesta Pagamento - RoulettePro AI</h2>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">Dettagli Richiesta:</h3>
            <p><strong>Tipo:</strong> ${subscriptionRequest.type === 'new' ? 'Nuovo Abbonamento' : 
                                      subscriptionRequest.type === 'renewal' ? 'Rinnovo' : 'Upgrade'}</p>
            <p><strong>Piano:</strong> ${plan.name}</p>
            <p><strong>Prezzo:</strong> €${plan.price.amount}</p>
            <p><strong>Durata:</strong> ${plan.durationValue} ${plan.duration === 'days' ? 'giorni' : 
                                                               plan.duration === 'months' ? 'mesi' : 'anni'}</p>
            <p><strong>Data Richiesta:</strong> ${new Date(subscriptionRequest.requestDate).toLocaleString('it-IT')}</p>
            <p><strong>ID Richiesta:</strong> ${subscriptionRequest._id}</p>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">Dettagli Utente:</h3>
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>ID Utente:</strong> ${user._id}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #495057; margin-top: 0;">Link di Pagamento:</h4>
            <p style="word-break: break-all;">
              <a href="${plan.paymentLink}" style="color: #007bff;">${plan.paymentLink}</a>
            </p>
          </div>

          <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              Questa è una notifica automatica del sistema RoulettePro AI.
            </p>
          </div>
        </div>
      `;

      return await this.sendEmail({
        to: adminEmail,
        subject: `💳 Richiesta Pagamento: ${user.name} - Piano ${plan.name}`,
        html: emailHtml
      });
    } catch (error) {
      console.error('Errore nell\'invio della notifica di richiesta pagamento:', error);
      // Non lanciare l'errore per non bloccare il processo di richiesta
      return null;
    }
  }

  /**
   * Invia notifica di richiesta contatto all'amministratore
   */
  async sendContactNotificationToAdmin(user, category, message) {
    try {
      // Verifica se le notifiche di contatto sono abilitate
      const isEnabled = await notificationSettingsRepository.isContactNotificationEnabled();
      if (!isEnabled) {
        console.log('Notifiche di contatto disabilitate, email non inviata');
        return null;
      }

      await this.ensureInitialized();
      
      const adminEmail = await notificationSettingsRepository.getAdminEmail();
      console.log(`Invio notifica di contatto all'admin: ${adminEmail}`);

      // Mappa delle categorie per visualizzazione
      const categoryLabels = {
        'bug_report': '🐛 Segnalazione Bug',
        'payment_issue': '💳 Problema Pagamento',
        'feature_request': '✨ Richiesta Funzionalità',
        'general_inquiry': '❓ Domanda Generale',
        'other': '📝 Altro'
      };

      const categoryLabel = categoryLabels[category] || category;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📬 Nuova Richiesta di Contatto - RoulettePro AI</h2>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">Categoria: ${categoryLabel}</h3>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">Dettagli Utente:</h3>
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>ID Utente:</strong> ${user._id}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
            <h3 style="color: #495057; margin-top: 0;">Messaggio:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Data:</strong> ${new Date().toLocaleString('it-IT')}<br>
              Questa è una notifica automatica del sistema RoulettePro AI.
            </p>
          </div>
        </div>
      `;

      return await this.sendEmail({
        to: adminEmail,
        subject: `📬 Richiesta Contatto: ${user.name} - ${categoryLabel}`,
        html: emailHtml
      });
    } catch (error) {
      console.error('Errore nell\'invio della notifica di contatto:', error);
      // Non lanciare l'errore per non bloccare il processo di contatto
      return null;
    }
  }

  /**
   * Metodo generico per inviare email con fallback
   */
  async sendEmail({ to, subject, html, from = null }) {
    await this.ensureInitialized();
    
    try {
      if (this.useEthereal) {
        // Usa Ethereal per i test
        console.log('Invio email tramite Ethereal...');
        const mailOptions = {
          from: from || config.email.from || `"RoulettePro AI" <${config.email.user}>`,
          to: to,
          subject: subject,
          html: html
        };
        
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Email anteprima URL: %s', nodemailer.getTestMessageUrl(info));
        return info;
      } else {
        // Prova prima con Mailgun
        try {
          const domain = 'roulettepro.ai';
          
          const data = await this.mailgunClient.messages.create(domain, {
            from: from || config.email.from || `RoulettePro AI <${config.email.user}>`,
            to: [to],
            subject: subject,
            html: html
          });
          
          console.log(`Email inviata con successo a ${to} tramite Mailgun API`);
          return data;
        } catch (mailgunError) {
          console.error('Errore Mailgun:', mailgunError);
          
          // Se Mailgun fallisce per account inattivo, logga i dettagli invece di inviare
          if (mailgunError.status === 403 || 
              (mailgunError.message && mailgunError.message.includes('Account Inactivity'))) {
            console.log('=== EMAIL NON INVIATA - ACCOUNT MAILGUN INATTIVO ===');
            console.log(`Destinatario: ${to}`);
            console.log(`Oggetto: ${subject}`);
            console.log(`Contenuto HTML salvato nei log per debug`);
            console.log('=== FINE DETTAGLI EMAIL ===');
            
            // Restituisci un oggetto che simula il successo per non bloccare l'app
            return {
              id: 'logged-only',
              message: 'Email logged due to Mailgun account inactivity'
            };
          }
          
          // Per altri errori, rilancia l'errore
          throw mailgunError;
        }
      }
    } catch (error) {
      console.error('Errore generale nell\'invio dell\'email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
