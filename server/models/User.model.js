const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] 
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be 8 characters or longer"]},

   isAdmin: {
     type: Boolean,
    default: false
   }
}, { timestamps: true,});

UserSchema.virtual('confirmPassword')
  .get(function() { return this._confirmPassword; })
  .set(function(value) { this._confirmPassword = value; });

UserSchema.pre('validate', function(next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', 'Password must match confirm password');
  }
  next();
});

  UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
      .then(hash => {
        this.password = hash;
        next();
      });
  });

module.exports = mongoose.model('User', UserSchema);
