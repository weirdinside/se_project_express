
const { UNAUTHORIZED, BAD_REQUEST, NOT_FOUND, DEFAULT } = require ('../utils/errors')
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')){
        return res.status(UNAUTHORIZED).send({message: "Unauthorized"});
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
        payload = jwt.verify(token, 'super-strong-secret');
      } catch (err) {
        return res.status(UNAUTHORIZED).send({message: "Unauthorized"})
      }
      req.user = payload;
      
      return next();
}