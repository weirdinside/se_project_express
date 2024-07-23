const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const {
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
