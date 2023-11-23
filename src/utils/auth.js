require("dotenv").config();
const bcrypt = require("bcryptjs");
const { SESSION_SECRET } = require("../constants/schema");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
};

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw Error;
  }
  try {
    const data = jwt.verify(token, SESSION_SECRET);
    if (data.accountId) {
      req.userId = data.accountId;
    } else {
      throw Error;
    }
    return next();
  } catch {
    return res.status(403).send({ message: "For hidden" });
  }
};

module.exports = {
  hashPassword,
  authorization,
};
