const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');
const Art = require('./artModel');

router.get('/', async (req, res) => {
    try {
      const search = req.query.search || '';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const user = await User.findOne({ _id: req.session.user.id });
  
      // Create a case-insensitive search query
      const searchQuery = {
        $or: [
          { Title: { $regex: new RegExp(search, 'i') } },
          { Artist: { $regex: new RegExp(search, 'i') } },
          { Category: { $regex: new RegExp(search, 'i') } }
        ]
      };
  
      // Fetch paginated results based on the search query
      const results = await Art.find(searchQuery)
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.render('search', {
        title: 'Artwork Search Results',
        user: user,
        results: results,
        search: search,
        page: page,
        limit: limit
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;