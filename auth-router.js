const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');

// Define the login route first

router.get('/', (req, res) => {
  const { user } = req.session;
  if(user) {
    res.redirect('/');
  } else {
    res.render('login', { title: 'Login' });
  }
});

// Define the generic route with :id parameter later

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  console.log('user');
  console.log(user);

  if (user) {
    req.session.user = { id: user._id, username: user.username };
    req.session.loggedIn = true;
    res.status(200).send();
  } else {
    res.status(401).send('Invalid username or password');
  }
});




module.exports = router;
