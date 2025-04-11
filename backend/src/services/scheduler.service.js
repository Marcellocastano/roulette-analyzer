/**
 * Servizio per la gestione dei job schedulati
 */
const cron = require('node-cron');
const checkExpiredSubscriptions = require('../scripts/check-expired-subscriptions');
const config = require('../config/config');

class SchedulerService {
  constructor() {
    this.jobs = [];
    this.isInitialized = false;
  }

  /**
   * Inizializza tutti i job schedulati
   */
  initialize() {
    if (this.isInitialized) {
      console.log('Scheduler già inizializzato');
      return;
    }

    // Verifica se siamo in produzione
    const isProduction = config.env === 'production';
    console.log(`Inizializzazione scheduler in ambiente: ${config.env}`);

    // Job per verificare le sottoscrizioni scadute (ogni giorno a mezzanotte)
    this.scheduleJob('checkExpiredSubscriptions', '0 0 * * *', async () => {
      console.log('Esecuzione job: controllo sottoscrizioni scadute');
      try {
        const result = await checkExpiredSubscriptions();
        console.log('Risultato controllo sottoscrizioni:', result);
      } catch (error) {
        console.error('Errore durante il controllo delle sottoscrizioni:', error);
      }
    }, isProduction);

    // Aggiungi qui altri job schedulati se necessario

    this.isInitialized = true;
    console.log('Scheduler inizializzato con successo');
  }

  /**
   * Schedula un nuovo job
   * @param {string} name - Nome del job
   * @param {string} schedule - Espressione cron (es. '0 0 * * *' per mezzanotte ogni giorno)
   * @param {Function} task - Funzione da eseguire
   * @param {boolean} onlyInProduction - Se true, il job viene eseguito solo in produzione
   */
  scheduleJob(name, schedule, task, onlyInProduction = false) {
    // Se onlyInProduction è true e non siamo in produzione, non schedulare il job
    if (onlyInProduction && config.env !== 'production') {
      console.log(`Job '${name}' non schedulato: esecuzione solo in produzione`);
      return;
    }

    try {
      // Verifica che l'espressione cron sia valida
      if (!cron.validate(schedule)) {
        throw new Error(`Espressione cron non valida: ${schedule}`);
      }

      // Crea e avvia il job
      const job = cron.schedule(schedule, task, {
        scheduled: true,
        timezone: 'Europe/Rome' // Imposta il fuso orario appropriato
      });

      // Salva il job nell'array
      this.jobs.push({
        name,
        schedule,
        job
      });

      console.log(`Job '${name}' schedulato con successo: ${schedule}`);
    } catch (error) {
      console.error(`Errore durante la schedulazione del job '${name}':`, error);
    }
  }

  /**
   * Esegue manualmente un job specifico
   * @param {string} name - Nome del job da eseguire
   */
  async runJobManually(name) {
    const jobInfo = this.jobs.find(j => j.name === name);
    if (!jobInfo) {
      console.error(`Job '${name}' non trovato`);
      return {
        success: false,
        message: `Job '${name}' non trovato`
      };
    }

    try {
      console.log(`Esecuzione manuale del job '${name}'`);
      // Estrai la funzione dal job e eseguila
      const taskFunction = jobInfo.job.options.task;
      await taskFunction();
      return {
        success: true,
        message: `Job '${name}' eseguito con successo`
      };
    } catch (error) {
      console.error(`Errore durante l'esecuzione manuale del job '${name}':`, error);
      return {
        success: false,
        message: `Errore durante l'esecuzione: ${error.message}`
      };
    }
  }

  /**
   * Ferma tutti i job schedulati
   */
  stopAll() {
    this.jobs.forEach(jobInfo => {
      jobInfo.job.stop();
      console.log(`Job '${jobInfo.name}' fermato`);
    });
    console.log('Tutti i job sono stati fermati');
  }
}

// Esporta un'istanza singleton del servizio
module.exports = new SchedulerService();
