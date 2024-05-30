const jwt = require("jsonwebtoken");

const checkRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res
    .status(403)
    .send("You do not have the required role to access this endpoint");
};

module.exports = { checkRole };
