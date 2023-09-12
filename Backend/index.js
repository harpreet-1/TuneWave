const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();

const dbConnection = require("./server");
const playlistRouter = require("./Routes/playlist.routes");
const usersRouter = require("./Routes/user.routes");
const songRouter = require("./Routes/song.routes");

app.get("/", (req, res) => {
  res.json({ message: "hello from tunewave server" });
});

app.use("/users", usersRouter);
app.use("/playlist", playlistRouter);
app.use("/song", songRouter);

app.listen(8080, () => {
  dbConnection();
  console.log("server st at 8080");
});
