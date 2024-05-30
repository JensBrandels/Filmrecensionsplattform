const bcrypt = require("bcryptjs");

const hashPassword = async (pw) => {
  const encryptedPW = await bcrypt.hash(pw, 10);
  return encryptedPW;
};

const comparePassword = async (pw, hashedpw) => {
  const passwordMatch = await bcrypt.compare(pw, hashedpw);
  return passwordMatch;
};

module.exports = {
  hashPassword,
  comparePassword,
};
