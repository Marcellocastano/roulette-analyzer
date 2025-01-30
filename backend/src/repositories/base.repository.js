class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findOne(conditions) {
    return await this.model.findOne(conditions);
  }

  async find(conditions = {}, options = {}) {
    const { 
      sort = {}, 
      limit = null, 
      skip = 0, 
      select = '', 
      populate = '' 
    } = options;

    let query = this.model.find(conditions);
    
    if (sort) query = query.sort(sort);
    if (limit) query = query.limit(limit);
    if (skip) query = query.skip(skip);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);

    return await query;
  }

  async findOneAndUpdate(conditions, update, options = { new: true }) {
    return await this.model.findOneAndUpdate(conditions, update, options);
  }

  async updateMany(conditions, update) {
    return await this.model.updateMany(conditions, update);
  }

  async deleteOne(conditions) {
    return await this.model.deleteOne(conditions);
  }

  async deleteMany(conditions) {
    return await this.model.deleteMany(conditions);
  }

  async count(conditions) {
    return await this.model.countDocuments(conditions);
  }
}

module.exports = BaseRepository;
