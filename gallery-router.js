const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');
const Art = require('./artModel');


router.use((req, res, next) => {
    req.page = parseInt(req.query.page) || 1;
    req.limit = parseInt(req.query.limit) || 10;
    next();
  });
  
// Route to get paginated artworks
router.get("/", async (req, res) => {
    try {
        const skip = (req.page - 1) * req.limit;

        const artworks = await Art.find().skip(skip).limit(req.limit);

        renderPage(req, res, artworks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function renderPage(req, res, artworks) {
    if(req.session.loggedIn) {
        const user = await User.findOne({ _id: req.session.user.id });
        if(user) {
            res.render('gallery', { title: 'Gallery', user: user, artworks: artworks, page: req.page, limit: req.limit });
        } else {
            res.redirect('/login');
        }
    }else{
        res.redirect('/login');
    }
};

router.post("/like", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const artwork = await Art.findOne({ _id: req.body.artworkId });
        user.liked.push(artwork._id);
        await user.save();
        artwork.Likes.push(req.session.user.id);
        await artwork.save();
        res.status(200).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/unlike", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const artwork = await Art.findOne({ _id: req.body.artworkId });
        user.liked.pull(artwork._id);
        await user.save();
        artwork.Likes.pull(req.session.user.id);
        await artwork.save();
        res.status(200).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/review", async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.session.user.id });
        const artwork = await Art.findOne({ _id: req.body.artworkId });
        const review = req.body.review;
        user.reviews.push({artwork: artwork._id, review: review});
        await user.save();
        artwork.reviews.push({review: review, user: user.username});
        await artwork.save();
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/deleteReview", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const artwork = await Art.findOne({ _id: req.body.artworkId });
        const review = req.body.review;

        // Remove the review from the user's reviews array
        user.reviews.pull(artwork._id);
        await user.save();

        // Remove the review from the artwork's reviews array
        artwork.reviews = artwork.reviews.filter(
            (r) => r.review !== review && r.user !== user.username
        );
        await artwork.save();

        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;