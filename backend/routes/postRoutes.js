const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, createPost);
router.get('/', getPosts);

module.exports = router;