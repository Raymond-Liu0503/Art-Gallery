const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');

router.get('/', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
    } else {
        res.render('signup', { title: 'Sign Up' });
    }
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    
    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    console.log('existingUser');
    console.log(existingUser);
    if (existingUser) {
        console.log('user exists');
        res.status(400).json({ error: "Username already taken" });
    } else {
        const newUser = new User({ username, password, accountType: "patron", liked: [], reviews: [], notifications: [], following: [], followers: [], artworks: [], joinedWorkshops: [], createdWorkshops: [] });
        await newUser.save();
        res.redirect('/login');
    }
});

module.exports = router;