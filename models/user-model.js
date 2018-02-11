const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  local       : {
    username  : String,
    email     : String,
    password  : String,
    firstName : String,
    lastName  : String,
    gender    : String,
    thumbnail : String,
  },

  twitter     : {
    id        : String,
    token     : String,
    username  : String,
    email     : String,
    thumbnail : String,
  },

  facebook    : {
    id        : String,
    token     : String,
    username  : String,
    email     : String,
    thumbnail : String,

  },

  google      : {
    id        : String,
    token     : String,
    username  : String,
    email     : String,
    thumbnail : String,
  },
})

const User = mongoose.model('user', userSchema);

// Generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = User;
