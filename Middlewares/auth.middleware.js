const jwt = require("jsonwebtoken");
const Blacklist = require("../Models/BlacklistModel");

const auth = async (req, res, next) => {
  const { refreshToken, authToken } = req.cookies;
  // console.log({ refreshToken, authToken });
  const blacklistData = await Blacklist.findOne({ refreshToken, authToken });
  
  if (blacklistData) {
    res.send({ message: "Not Authorized" });
  } else {
    try {
      jwt.verify(authToken, process.env.authToken, (err, data) => {
        if (data) {
          console.log("auth token");
          console.log({ authToken });
          next();
        } else {
          jwt.verify(refreshToken, process.env.refreshToken, (err, data) => {
            if (data) {
              console.log("refresh token");
              const newToken = jwt.sign(
                { email: data.email, id: data._id },
                process.env.authToken,
                {
                  expiresIn: "1h",
                }
              );
              console.log({ newToken });
              res.cookie("authToken", newToken, {
                httpOnly: true,
                maxAge: 1 * 60 * 60 * 1000,
              });
              next();
            } else {
              throw new Error({ error: "Not Authorized" });
            }
          });
        }
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};

module.exports = auth;
