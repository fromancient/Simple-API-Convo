const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const { validate, postSchemas } = require('../middleware/validation');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  getPostsByAuthor,
  getFeaturedPosts,
  toggleLike
} = require('../controllers/postController');

// Public routes
router.get('/', optionalAuth, getPosts);
router.get('/search', searchPosts);
router.get('/featured', getFeaturedPosts);
router.get('/author/:authorId', getPostsByAuthor);
router.get('/:id', optionalAuth, getPost);

// Protected routes
router.post('/', auth, validate(postSchemas.create), createPost);
router.put('/:id', auth, validate(postSchemas.update), updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, toggleLike);

module.exports = router; 