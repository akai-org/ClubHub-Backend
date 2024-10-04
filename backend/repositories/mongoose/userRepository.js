const BaseMongooseRepository = require('./BaseMongooseRepository')

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
    return { succesfull: true, duplicate: false, message: "User saved in database", error: false }
  }

  async FindByUuid(id) {
    const user = await this.model.findOne({ uuid: id }).select('-password -__v -_id');
    if (user) {
      return user
    }
    return false
  }

  async FindByEmail(email) {
    const user = await this.model.findOne({ email: email });
    if (user) {
      return user
    }
    return false
  }

  async FindByUserName(username) {
    const user = await this.model.findOne({ username: username });
    if (user) {
      return user
    }
    return false
  }
}

module.exports = UserRepository