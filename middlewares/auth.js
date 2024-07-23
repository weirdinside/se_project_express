const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization error" });
  }

  const token = auth.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization error" });
  }
  req.user = payload;

  return next();
};