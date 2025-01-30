const BaseRepository = require('./base.repository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async findByEmailWithPassword(email) {
    return await this.model.findOne({ email }).select('+password');
  }

  async updateSubscription(userId, subscriptionData) {
    return await this.findOneAndUpdate(
      { _id: userId },
      { 
        $set: { 
          'subscription.plan': subscriptionData.plan,
          'subscription.startDate': subscriptionData.startDate,
          'subscription.endDate': subscriptionData.endDate,
          'subscription.status': subscriptionData.status,
          'subscription.features': subscriptionData.features
        }
      }
    );
  }

  async updateLastLogin(userId) {
    return await this.findOneAndUpdate(
      { _id: userId },
      { $set: { lastLogin: new Date() } }
    );
  }

  async setPasswordResetToken(email, token, expires) {
    return await this.findOneAndUpdate(
      { email },
      {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: expires
        }
      }
    );
  }

  async findByResetToken(token) {
    return await this.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
  }

  async updatePassword(userId, hashedPassword) {
    return await this.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          passwordResetToken: undefined,
          passwordResetExpires: undefined
        }
      }
    );
  }
}

module.exports = new UserRepository();
