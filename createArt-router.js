const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');
const Art = require('./artModel');

router.get("/", async (req, res) => {
    try {
      // Check if the current user is an artist (customize this based on your authentication setup)
      const user = await User.findOne({ _id: req.session.user.id });
  
      if (!user) {
        // Handle the case where the user is not found
        return res.status(404).render("error", { title: "User Not Found" });
      }
  
      const isArtist = user.accountType === "artist";
  
      if (isArtist) {
        // Render the Pug page for adding artwork
        return res.render("create", { title: "Add Artwork", user: user });
      } else {
        // Redirect or handle the case where the user is not an artist
        return res.redirect("/"); // Redirect to the home page for example
      }
    } catch (error) {
      console.error(error);
      // Handle other errors (500 Internal Server Error) gracefully
      return res.status(500).render("error", { title: "Internal Server Error" });
    }
  });
  
  

// Express route to handle adding a new artwork
router.post("/add", async (req, res) => {
    try {
      // Retrieve the artwork details from the request body
      const artist = await User.findOne({ _id: req.session.user.id });

      const { title, description, year, category, medium, poster } = req.body;
      // Create a new artwork using the Mongoose model
      const newArtwork = new Art({
        Title: title,
        Artist: artist.username,
        Description: description,
        Year: year,
        Category: category,
        Medium: medium,
        Poster: poster,
        Likes: [], 
        reviews: [], 
      });
  
      artist.artworks.push(newArtwork);
      await artist.save();
      await newArtwork.save();

      for(let i = 0; i < artist.followers.length; i++) {
        const follower = await User.findOne({ _id: artist.followers[i] });
        follower.notifications.push(artist.username + " has posted a new artwork.");
        await follower.save();
      }
      // Redirect the user to the gallery or another appropriate page
      res.redirect("/gallery");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

module.exports = router;