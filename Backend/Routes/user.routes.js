const express = require("express");

const bcrypt = require("bcrypt");

const ValidateUserDetails = require("../Middlewares/ValidateUserDetails");
const UserModel = require("../models/userModel");
const BlacklistModel = require("../Models/blacklistModel");

const usersRouter = express.Router();

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        status: "error",
        message: "user alredy exists please login",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.HASH_SALT_ROUND)
    );

    const newUser = await UserModel.create({
      email,
      username,
      password: hashedPassword,
    });
    const token = user.generateAuthToken();
    return res.status(200).json({
      status: "success",
      message: "Congratulations! You have successfully registered.",
      user: { username, email: email, userId: newUser._id, role: user.role },
      token: token,
    });
  } catch (error) {
    console.log(
      "*******************error from user register**********************",
      error
    );
    return res.status(500).json({
      status: "error",
      message: "server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = user.generateAuthToken();
      return res.status(200).json({
        status: "success",
        message: "Login Successful",
        user: {
          username: user.username,
          email,
          userId: user._id,
          role: user.role,
        },
        token: token,
      });
    }
  } catch (error) {
    console.log("error from user login", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.headers["auth-token"];
    if (token) {
      await BlacklistModel.create({ token });
      res.status(200).josn({ success: true, msg: "Logout sucsessfull" });
    }
  } catch (error) {
    console.log("error from user logout", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
usersRouter.post("/login", loginUser);
usersRouter.post("/register", ValidateUserDetails, registerUser);
usersRouter.post("/logout", logoutUser);
usersRouter.get("/", getUsers);

module.exports = usersRouter;
