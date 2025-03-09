const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;  
    const post = new Post({
      title,
      content,
      authorId
    });
    await post.save();
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { author } = req.query;
    
    let query = {};
    if (author) {
      query.authorId = author;
    }
    
    const posts = await Post.find(query).sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts
};