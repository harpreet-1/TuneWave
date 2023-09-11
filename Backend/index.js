const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();
const dbConnection = require("./server");
const usersRouter = require("./routes/user.routes");

app.get("/", (req, res) => {
  res.json({ message: "hello from tunewave server" });
});

app.use("/users", usersRouter);

app.listen(8080, () => {
  dbConnection();
  console.log("server st at 8080");
});
