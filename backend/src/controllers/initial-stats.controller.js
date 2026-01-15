const InitialStatsService = require('../services/initial-stats.service');

class InitialStatsController {
  constructor() {
    this.service = InitialStatsService;
  }

  addInitialStats = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const stats = req.body;

      // Validazione input
      this._validateStats(stats);

      const result = await this.service.addInitialStats(userId, stats);
      
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  addInitialStatsAdvanced = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const stats = req.body;

      // Validazione input
      this._validateStatsAdvanced(stats);
      const result = await this.service.addInitialStatsAdvanced(userId, stats);
      
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getLatestStats = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const stats = await this.service.getLatestStats(userId);
      
      if (!stats) {
        return res.status(404).json({
          status: 'error',
          message: 'Nessuna statistica iniziale trovata'
        });
      }

      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  _validateStats(stats) {
    // Verifica presenza oggetti necessari
    if (!stats.stats50 || !stats.stats500) {
      throw new Error('Statistiche a 50 e 500 spin richieste');
    }

    // Verifica dozzine
    if (!stats.stats500.dozens || 
          !stats.stats500.dozens.first || 
          !stats.stats500.dozens.second || 
          !stats.stats500.dozens.third) {
        throw new Error('Statistiche dozzine mancanti per stats500');
      }

    // Verifica zona zero
    if (!stats.stats50.zeroNeighbors || !stats.stats500.zeroNeighbors) {
      throw new Error('Statistiche zona zero mancanti');
    }

    // Verifica numeri per analisi trend
    if (!stats.stats50.numbers || !stats.stats500.numbers) {
      throw new Error('Statistiche dei singoli numeri richieste per analisi trend');
    }
  }
  
  _validateStatsAdvanced(stats) {
    // Almeno uno tra sufferingDozen e growingZeroNumbers deve essere presente
    if (!stats.sufferingDozen && (!stats.growingZeroNumbers || stats.growingZeroNumbers.length === 0)) {
      throw new Error('Specificare almeno la dozzina sofferente o i numeri in crescita della zona zero');
    }

    // Valida sufferingDozen se presente
    if (stats.sufferingDozen && ![1, 2, 3].includes(stats.sufferingDozen)) {
      throw new Error('La dozzina sofferente deve essere 1, 2 o 3');
    }

    // Valida surplusDozen se presente
    if (stats.surplusDozen && ![1, 2, 3].includes(stats.surplusDozen)) {
      throw new Error('La dozzina in surplus deve essere 1, 2 o 3');
    }

    // Valida growingZeroNumbers se presente
    const validZeroNumbers = [0, 3, 12, 15, 26, 32, 35];
    if (stats.growingZeroNumbers && stats.growingZeroNumbers.length > 0) {
      const invalidNumbers = stats.growingZeroNumbers.filter(n => !validZeroNumbers.includes(n));
      if (invalidNumbers.length > 0) {
        throw new Error(`Numeri non validi per la zona zero: ${invalidNumbers.join(', ')}. Validi: ${validZeroNumbers.join(', ')}`);
      }
    }

    // Valida tableStatus se presente
    if (stats.tableStatus && !['recommended', 'borderline', 'not_recommended'].includes(stats.tableStatus)) {
      throw new Error('Lo status del tavolo deve essere: recommended, borderline o not_recommended');
    }
  }
}

module.exports = InitialStatsController;
