const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  mobile: { type: Number },
  password: { type: String, required: true },
  address: String,
  pincode: Number,
  role: { type: String, enum: ["cutmore", "user"], default: "user" },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { user: { id: this._id, username: this.username, email: this.email } },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "3d",
    }
  );
  return token;
};
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
