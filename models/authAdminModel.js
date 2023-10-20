import mongoose from "mongoose";
const authAdminSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    isLogin: {type: Boolean, default: false},
    lastLogin: {type: Date}
});
authAdminSchema.pre('save', function (next) {
    if (this.isModified('isLogin')&&this.isLogin===true) {
      this.lastLogin = new Date();
    }
    
    next();
  });
  
  const AuthAdmin = mongoose.model('Auth_Admin', authAdminSchema);

export default AuthAdmin;
