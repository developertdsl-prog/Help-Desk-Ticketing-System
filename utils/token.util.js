const jwt = require('jsonwebtoken');

const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
};

const validateResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

module.exports = { generateResetToken, validateResetToken };