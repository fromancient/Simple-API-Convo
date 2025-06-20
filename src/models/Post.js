const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for reading time (estimated)
postSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Indexes for better query performance
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, isPublic: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ featured: 1, createdAt: -1 });

// Generate slug before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Instance method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(likeIndex, 1);
  }
  return this.save();
};

// Static method to find posts by author
postSchema.statics.findByAuthor = function(authorId) {
  return this.find({ author: authorId, isPublic: true, status: 'published' })
    .populate('author', 'username profile.firstName profile.lastName')
    .sort({ createdAt: -1 });
};

// Static method to find featured posts
postSchema.statics.findFeatured = function() {
  return this.find({ 
    featured: true, 
    isPublic: true, 
    status: 'published' 
  })
    .populate('author', 'username profile.firstName profile.lastName')
    .sort({ createdAt: -1 });
};

// Static method to search posts
postSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    isPublic: true,
    status: 'published'
  })
    .populate('author', 'username profile.firstName profile.lastName')
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Post', postSchema); 