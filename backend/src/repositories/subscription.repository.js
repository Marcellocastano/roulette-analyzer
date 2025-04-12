const BaseRepository = require('./base.repository');
const { Subscription } = require('../models');
const { User, Plan } = require('../models');

class SubscriptionRepository extends BaseRepository {
  constructor() {
    super(Subscription);
  }

  async findActiveByUserId(userId) {
    return await this.findOne({ 
      userId, 
      status: 'active',
      startDate: { $lte: new Date() },
      $or: [
        { endDate: null },
        { endDate: { $gt: new Date() } }
      ]
    });
  }

  async findByUserId(userId) {
    return await this.find({ userId });
  }

  async findById(subscriptionId) {
    return await this.findOne({ _id: subscriptionId });
  }

  async updateStatus(subscriptionId, status) {
    return await this.findOneAndUpdate(
      { _id: subscriptionId },
      { $set: { status } }
    );
  }

  async incrementSessionCount(subscriptionId) {
    return await this.findOneAndUpdate(
      { _id: subscriptionId },
      { 
        $inc: { 'sessions.count': 1 },
        $set: { 'sessions.lastUpdated': new Date() }
      }
    );
  }

  async resetSessionCount(subscriptionId) {
    return await this.findOneAndUpdate(
      { _id: subscriptionId },
      { 
        $set: { 
          'sessions.count': 0,
          'sessions.lastReset': new Date() 
        } 
      }
    );
  }

  async checkSessionLimit(subscriptionId) {
    try {
      const subscription = await this.findById(subscriptionId);
      if (!subscription) {
        return { allowed: false, message: 'Abbonamento non trovato' };
      }

      // Carica il piano associato alla sottoscrizione
      await subscription.populate('planId');
      const plan = subscription.planId;
      
      if (!plan) {
        return { allowed: false, message: 'Piano non trovato' };
      }
      // Verifica il limite in base al piano di abbonamento
      const count = subscription.sessions?.count || 0;
      const limit = plan.sessions?.total || 0;
      const allowed = count < limit || limit === 0; // 0 significa illimitato
      return { 
        allowed, 
        count, 
        message: allowed ? null : `limit-${limit}`
      };
    } catch (error) {
      console.error('Errore durante il controllo del limite di sessioni:', error);
      return { allowed: false, message: 'Errore durante la verifica del limite' };
    }
  }

  async findExpiredSubscriptions() {
    const now = new Date();
    return await this.find({
      status: 'active',
      endDate: { $lte: now }
    });
  }
}

module.exports = new SubscriptionRepository();
