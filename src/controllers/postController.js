const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, author, tag, featured } = req.query;

    // Build query
    const query = { isPublic: true, status: 'published' };

    if (status) query.status = status;
    if (author) query.author = author;
    if (tag) query.tags = { $in: [tag] };
    if (featured === 'true') query.featured = true;

    const posts = await Post.find(query)
      .populate('author', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profile.firstName profile.lastName');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if post is public and published
    if (!post.isPublic || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    await post.incrementViews();

    res.json({
      success: true,
      data: {
        post
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post'
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, tags, status, isPublic, featured } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id,
      tags,
      status,
      isPublic,
      featured
    });

    await post.save();

    // Populate author info
    await post.populate('author', 'username profile.firstName profile.lastName');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { title, content, tags, status, isPublic, featured } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;
    if (status) updateData.status = status;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (featured !== undefined && req.user.role === 'admin') updateData.featured = featured;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username profile.firstName profile.lastName');

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post'
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post'
    });
  }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const posts = await Post.search(q)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      $text: { $search: q },
      isPublic: true,
      status: 'published'
    });

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching posts'
    });
  }
};

// @desc    Get posts by author
// @route   GET /api/posts/author/:authorId
// @access  Public
const getPostsByAuthor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.findByAuthor(req.params.authorId)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      author: req.params.authorId,
      isPublic: true,
      status: 'published'
    });

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get posts by author error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts by author'
    });
  }
};

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
const getFeaturedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const posts = await Post.findFeatured().limit(limit);

    res.json({
      success: true,
      data: {
        posts
      }
    });
  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured posts'
    });
  }
};

// @desc    Toggle post like
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.isPublic || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.toggleLike(req.user._id);

    res.json({
      success: true,
      message: 'Like toggled successfully',
      data: {
        likes: post.likes.length
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like'
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  getPostsByAuthor,
  getFeaturedPosts,
  toggleLike
}; 