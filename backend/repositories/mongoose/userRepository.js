const BaseMongooseRepository = require('./BaseMongooseRepository')
const errors = require('../../utils/error/appError')

const userSchema = {
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {type : Date, default : Date.now()}, 
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  //membership: [{ type: String, ref: 'science_clubs' }]
}

class UserRepository extends BaseMongooseRepository {
  constructor() {
    super('user_accounts', userSchema);
  }

  async insert(userdata) {
    const user = this.model(userdata)
    await user.save()
    return user.toObject();
  }

  async FindByUuid(id) {
    const user = await this.model.findOne({ uuid: id }).select('-password -__v -_id');
    if (user) {
      return user.toObject()
    }
    return undefined
  }

  async FindByEmail(email) {
    const user = await this.model.findOne({ email: email });
    if (user) {
      return user.toObject();
    }
    return undefined
  }

  async FindByUserName(username) {
    const user = await this.model.findOne({ username: username });
    if (user) {
      return user.toObject()
    }
    return undefined
  }

  async updateOne(queries, data){
    let immutableFields = ['uuid', 'createdAt', 'email']; 
    let incorectFields = [];

    immutableFields.forEach(field => {
      if(data[field]){
        incorectFields.push(`${field} is immutable property`);
      }
    });

    if(incorectFields.length > 0){
      let errorMessage = incorectFields.join(";"); 
      throw new errors.ImmutableFieldError(errorMessage);
    }

    let res = await this.model.updateOne(queries, {$set :data}); 
    if(res.matchedCount === 0){
      throw new errors.NotFoundError("User not Found"); 
    }
    return {user : `users modified: ${res.modifiedCount}`}; 
  }

}

module.exports = UserRepository