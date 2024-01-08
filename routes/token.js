const { passwordHashing } = require("./hashing");

const jwt = require('jsonwebtoken');
const secretKey = passwordHashing("password");

const checkJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send('Invalid Token.');
  }
};

module.exports = {checkJWT};