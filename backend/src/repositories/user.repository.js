const BaseRepository = require('./base.repository');
const { User } = require('../models');
const subscriptionRepository = require('./subscription.repository');
const planRepository = require('./plan.repository');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
    this.subscriptionRepository = subscriptionRepository;
    this.planRepository = planRepository;
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }
  
  async findById(userId) {
    return await this.findOne({ _id: userId });
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
          'subscription.duration': subscriptionData.duration,
          'subscription.startDate': subscriptionData.startDate,
          'subscription.endDate': subscriptionData.endDate,
          'subscription.status': subscriptionData.status,
          'subscription.newRequest': subscriptionData.newRequest
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

  async updateTrialStatus(userId) {
    return await this.findOneAndUpdate(
      { _id: userId },
      { $set: { isTrialUsed: true } }
    );
  }

  async findByResetToken(token) {
    return await this.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
  }

  async setEmailConfirmationToken(email, token, expires) {
    return await this.findOneAndUpdate(
      { email },
      {
        $set: {
          emailConfirmationToken: token,
          emailConfirmationExpires: expires
        }
      }
    );
  }

  async findByEmailConfirmationToken(token) {
    return await this.findOne({
      emailConfirmationToken: token,
      emailConfirmationExpires: { $gt: Date.now() }
    });
  }

  async activateAccount(userId) {
    return await this.findOneAndUpdate(
      { _id: userId },
      { $set: { active: true, emailConfirmationToken: null, emailConfirmationExpires: null } }
    );
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

  async getDailySessionCount(userId) {
    const user = await this.findById(userId);
    if (!user) return 0;

    const subscription = await this.subscriptionRepository.findById(user.activeSubscription);
    if (!subscription) return 0;

    return subscription.sessions?.count || 0;
  }
}

module.exports = new UserRepository();
