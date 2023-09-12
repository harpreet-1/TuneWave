const express = require("express");
const playlistRouter = express.Router();
const PlaylistModel = require("../models/playlistModel");
const UserModel = require("../models/userModel");

playlistRouter.post("/add", async (req, res) => {
  const { user } = req;
  try {
    const foundUser = await UserModel.findById(user._id);
    const playlist = await PlaylistModel.create({
      ...req.body,
      user: user._id,
    });
    foundUser.playlists.push(playlist._id);
    await foundUser.save();
    res.status(200).json({ success: true, playlist });
  } catch (error) {
    console.log("error from playlist/add", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

//edit playlist by id
playlistRouter.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const { name, desc, img } = req.body;
  try {
    const playlist = await PlaylistModel.findById(id);
    if (!playlist)
      return res
        .status(400)
        .json({ success: false, message: "Playlist not found" });

    if (user._id != playlist.user) {
      return res
        .status(403)
        .json({ success: false, message: "User don't have access to edit!" });
    }

    playlist.name = name;
    playlist.desc = desc;
    playlist.img = img;
    await playlist.save();

    res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log("error from playlist/edit", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

//add song in playlist******************
playlistRouter.patch("/add-song", async (req, res) => {
  const { user } = req;
  try {
    const playlist = await PlaylistModel.findById(req.body.playlistId);
    if (user._id != playlist.user)
      return res
        .status(403)
        .json({ success: false, message: "User don't have access to add!" });

    if (playlist.songs.indexOf(req.body.songId) === -1) {
      playlist.songs.push(req.body.songId);
    }

    await playlist.save();
    res.status(200).json({
      success: true,
      playlist,
      message: "Song added successfully",
    });
  } catch (error) {
    console.log("error from playlist/add-song", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

//remove song from playlist**************
playlistRouter.delete("/remove-song/:songId/:playlistId", async (req, res) => {
  const { user } = req;
  const { playlistId, songId } = req.params;
  try {
    const playlist = await PlaylistModel.findById(playlistId);

    if (user._id != playlist.user) {
      return res
        .status(403)
        .json({ success: false, message: "User don't have access to Remove!" });
    }

    const index = playlist.songs.indexOf(songId);
    playlist.songs.splice(index, 1);
    await playlist.save();
    res.status(200).json({
      success: true,
      playlist,
      message: "Removed from playlist",
    });
  } catch (error) {
    console.log("error from playlist/remove-song", error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
});

module.exports = playlistRouter;
