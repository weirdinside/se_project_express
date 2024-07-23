const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const {
  getCurrentUser,
  getUsers,
  createUser,
  getUserById,
} = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

// router.get("/", getUsers);
// router.get("/:userId", getUserById);
// router.post("/", createUser);

module.exports = router;
