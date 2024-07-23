const router = require("express").Router();
const clothingItems = require("./clothingItems");
const user = require("./users");
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.use("/users", user);
router.use("/items", clothingItems);

router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res
    .status(NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

module.exports = router;