const SongModel = require("../models/songModel");
const express = require("express");
const songRouter = express.Router();

///uploead song*************
songRouter.post("/upload", async (req, res) => {
  try {
    const song = await SongModel.create(req.body);
    res
      .status(200)
      .json({ success: true, song, msg: "Song created successfully" });
  } catch (error) {
    console.log("error from song/upload", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

//get all song***********
songRouter.get("/", async (req, res) => {
  try {
    const songs = await SongModel.find();
    res.status(200).json({ success: true, data: songs });
  } catch (error) {
    console.log("error from playlist/remove-song", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

//get  song by id**********
songRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await SongModel.findById(id);
    res.status(200).json({ success: true, data: songs });
  } catch (error) {
    console.log("error from get song/:id", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

//update songs*******

songRouter.patch("/update/:id", async (req, res) => {
  try {
    const song = await SongModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ success: true, data: song, msg: "song updated succsessfully" });
  } catch (error) {
    console.log("error from song/upadate/:id", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

//delete song by id*********

songRouter.delete("/delete/:id", async (req, res) => {
  try {
    await SongModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Song deleted succsessfully");
  } catch (error) {
    console.log("error from song/delete/:id ", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

module.exports = songRouter;
