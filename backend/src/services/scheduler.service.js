/**
 * Servizio per la gestione dei job schedulati
 */
const cron = require('node-cron');
const checkExpiredSubscriptions = require('../scripts/check-expired-subscriptions');
const resetDailySessions = require('../scripts/reset-daily-sessions');
const cleanupInactiveStats = require('../scripts/cleanup-inactive-stats');
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

    // Job per verificare le sottoscrizioni scadute (ogni 4 ore)
    this.scheduleJob('checkExpiredSubscriptions', '0 * * * *', async () => {
      console.log('Esecuzione job: controllo sottoscrizioni scadute');
      try {
        const result = await checkExpiredSubscriptions();
        console.log('Risultato controllo sottoscrizioni:', result);
      } catch (error) {
        console.error('Errore durante il controllo delle sottoscrizioni:', error);
      }
    }, isProduction);

    // Job per resettare i contatori delle sessioni giornaliere (ogni giorno a mezzanotte)
    this.scheduleJob('resetDailySessions', '0 0 * * *', async () => {
      console.log('Esecuzione job: reset contatori sessioni giornaliere');
      try {
        const result = await resetDailySessions();
        console.log('Risultato reset sessioni:', result);
      } catch (error) {
        console.error('Errore durante il reset delle sessioni:', error);
      }
    }, false); // Esegui in tutti gli ambienti

    // Job per pulire i record inattivi (ogni ora)
    this.scheduleJob('cleanupInactiveStats', '0 * * * *', async () => {
      console.log('Esecuzione job: pulizia record inattivi');
      try {
        const result = await cleanupInactiveStats();
        console.log('Risultato pulizia record:', result);
      } catch (error) {
        console.error('Errore durante la pulizia dei record:', error);
      }
    }, false); // Esegui in tutti gli ambienti

    // Esegui subito il reset delle sessioni all'avvio del server
    this.runJobManually('resetDailySessions')
      .then(result => console.log('Reset sessioni all\'avvio:', result))
      .catch(error => console.error('Errore nel reset sessioni all\'avvio:', error));

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
    // Esecuzione diretta degli script se il job non è stato ancora inizializzato
    if (name === 'checkExpiredSubscriptions') {
      try {
        console.log(`Esecuzione diretta dello script di controllo sottoscrizioni scadute`);
        const checkExpiredSubscriptions = require('../scripts/check-expired-subscriptions');
        const result = await checkExpiredSubscriptions();
        return {
          success: true,
          message: `Controllo sottoscrizioni scadute eseguito con successo`,
          data: result
        };
      } catch (error) {
        console.error(`Errore durante l'esecuzione dello script:`, error);
        return {
          success: false,
          message: `Errore durante l'esecuzione: ${error.message}`
        };
      }
    } else if (name === 'resetDailySessions') {
      try {
        console.log(`Esecuzione diretta dello script di reset sessioni giornaliere`);
        const resetDailySessions = require('../scripts/reset-daily-sessions');
        const result = await resetDailySessions();
        return {
          success: true,
          message: `Reset sessioni giornaliere eseguito con successo`,
          data: result
        };
      } catch (error) {
        console.error(`Errore durante l'esecuzione dello script:`, error);
        return {
          success: false,
          message: `Errore durante l'esecuzione: ${error.message}`
        };
      }
    } else if (name === 'cleanupInactiveStats') {
      try {
        console.log(`Esecuzione diretta dello script di pulizia record inattivi`);
        const cleanupInactiveStats = require('../scripts/cleanup-inactive-stats');
        const result = await cleanupInactiveStats();
        return {
          success: true,
          message: `Pulizia record inattivi eseguita con successo`,
          data: result
        };
      } catch (error) {
        console.error(`Errore durante l'esecuzione dello script:`, error);
        return {
          success: false,
          message: `Errore durante l'esecuzione: ${error.message}`
        };
      }
    }
    
    // Altrimenti, cerca il job nell'array dei job schedulati
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
      
      // Verifica che il job e la funzione di task esistano
      if (!jobInfo.job || !jobInfo.job.options || typeof jobInfo.job.options.task !== 'function') {
        throw new Error(`La funzione di task per il job '${name}' non è valida`);
      }
      
      // Esegui la funzione di task
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
