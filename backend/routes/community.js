const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
  getPostsByCategory,
  getUserPosts,
  searchPosts,
  getCommunityStats
} = require('../controllers/community');

router.get('/posts', protect, getPosts);
router.post('/posts', protect, createPost);
router.get('/posts/:id', protect, getPost);
router.put('/posts/:id', protect, updatePost);
router.delete('/posts/:id', protect, deletePost);
router.put('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comments', protect, addComment);
router.delete('/posts/:id/comments/:commentId', protect, deleteComment);
router.get('/posts/category/:category', protect, getPostsByCategory);
router.get('/posts/user/:userId', protect, getUserPosts);
router.get('/search', protect, searchPosts);
router.get('/stats', protect, getCommunityStats);

module.exports = router;
