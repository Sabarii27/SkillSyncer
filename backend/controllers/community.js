const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

// @desc    Get all community posts
// @route   GET /api/community/posts
// @access  Private
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create a new community post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    const post = await CommunityPost.create({
      userId: req.user.id,
      content
    });
    
    // Populate user info
    await post.populate('userId', 'name');
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Like a community post
// @route   PUT /api/community/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Check if user has already liked the post
    if (post.likes.includes(req.user.id)) {
      // Unlike the post
      post.likes = post.likes.filter(
        like => like.toString() !== req.user.id.toString()
      );
    } else {
      // Like the post
      post.likes.push(req.user.id);
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add a comment to a community post
// @route   POST /api/community/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Database not connected, return mock response
      console.log('Database not connected, returning mock comment data');
      const mockComment = {
        _id: new mongoose.Types.ObjectId(),
        userId: { _id: req.user.id, name: 'Current User' },
        text: req.body.text,
        createdAt: new Date(),
        likes: []
      };
      
      return res.status(200).json({
        success: true,
        data: {
          comments: [mockComment]  // Return as if this was added to a post
        }
      });
    }
    
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const comment = {
      userId: req.user.id,
      text: req.body.text
    };
    
    post.comments.push(comment);
    await post.save();
    
    // Populate user info for the new comment
    await post.populate({
      path: 'comments.userId',
      select: 'name'
    });
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single community post
// @route   GET /api/community/posts/:id
// @access  Private
exports.getPost = async (req, res, next) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Database not connected, return mock post data
      console.log('Database not connected, returning mock post data');
      const mockPost = {
        _id: req.params.id,
        title: 'Mock Post',
        content: 'This is a mock post since database is not connected.',
        userId: { _id: req.user.id, name: 'Current User' },
        comments: [],
        likes: [],
        createdAt: new Date()
      };
      
      return res.status(200).json({
        success: true,
        data: mockPost
      });
    }
    
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name')
      .populate('comments.userId', 'name');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update community post
// @route   PUT /api/community/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Make sure user owns the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this post'
      });
    }
    
    post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'name');
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete community post
// @route   DELETE /api/community/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Make sure user owns the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }
    
    await post.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/community/posts/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Make sure user owns the comment
    if (comment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }
    
    comment.remove();
    await post.save();
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get posts by category/tag
// @route   GET /api/community/posts/category/:category
// @access  Private
exports.getPostsByCategory = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find({ 
      category: req.params.category 
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get user's posts
// @route   GET /api/community/posts/user/:userId
// @access  Private
exports.getUserPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find({ 
      userId: req.params.userId 
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Search posts
// @route   GET /api/community/search
// @access  Private
exports.searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const posts = await CommunityPost.find({
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get community stats
// @route   GET /api/community/stats
// @access  Private
exports.getCommunityStats = async (req, res, next) => {
  try {
    const totalPosts = await CommunityPost.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const topContributors = await CommunityPost.aggregate([
      {
        $group: {
          _id: '$userId',
          postCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          postCount: 1
        }
      },
      {
        $sort: { postCount: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    const recentActivity = await CommunityPost.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('content userId createdAt');
    
    res.status(200).json({
      success: true,
      data: {
        totalPosts,
        totalUsers,
        topContributors,
        recentActivity
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
