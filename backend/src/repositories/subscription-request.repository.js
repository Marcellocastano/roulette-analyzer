const BaseRepository = require('./base.repository');
const { SubscriptionRequest } = require('../models');

class SubscriptionRequestRepository extends BaseRepository {
  constructor() {
    super(SubscriptionRequest);
  }

  async findPendingByUserId(userId) {
    return await this.findOne({ 
      userId, 
      status: 'pending' 
    });
  }

  async findByUserId(userId) {
    return await this.find({ userId });
  }

  async updateStatus(requestId, status, processedBy = null) {
    const updateData = { 
      status,
      processedDate: new Date()
    };
    
    if (processedBy) {
      updateData.processedBy = processedBy;
    }
    
    return await this.findOneAndUpdate(
      { _id: requestId },
      { $set: updateData }
    );
  }

  async linkToSubscription(requestId, subscriptionId) {
    return await this.findOneAndUpdate(
      { _id: requestId },
      { $set: { resultingSubscription: subscriptionId } }
    );
  }
}

module.exports = new SubscriptionRequestRepository();
