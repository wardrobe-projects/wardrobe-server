const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema ({
  username : {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, 8);
};

UserSchema.methods.validateHash = (password) => {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
