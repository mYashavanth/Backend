const express = require("express");
const userRouter = express.Router();
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Blacklist = require("../Models/BlacklistModel");

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 5, function (err, hash) {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        const user = new User({
          name,
          email,
          password: hash,
        });
        user
          .save()
          .then(() => {
            res.status(200).send(user);
          })
          .catch((err) => {
            res.status(500).send({ error: err.message });
          });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          const authToken = jwt.sign(
            { userID: user._id },
            process.env.authToken,
            {
              expiresIn: "1h",
            }
          );
          const refreshToken = jwt.sign(
            { userID: user._id },
            process.env.refreshToken,
            {
              expiresIn: "7d",
            }
          );
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,

          });
          res.cookie("authToken", authToken, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
          });
          res
            .status(200)
            .send({ msg: "Login Successful"});
        } else {
          res.status(400).send({ msg: "Wrong Credentials" });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    const {authToken, refreshToken} = req.cookies;
    const blacklist = new Blacklist({
      authToken,
      refreshToken
    });
    await blacklist.save();
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.status(200).send({ msg: "Logout Successful",blacklist });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = userRouter;
