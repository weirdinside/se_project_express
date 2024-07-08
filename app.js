const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to database");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "668a56e46b9a9e0e74038b18", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
