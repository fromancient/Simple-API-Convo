const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    bio: 'This is a test user'
  }
};

const testPost = {
  title: 'My First Post',
  content: 'This is the content of my first post.',
  tags: ['test', 'first-post'],
  status: 'published',
  isPublic: true
};

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🔍 Testing Health Check...');
  const result = await apiCall('GET', '/health');
  if (result) {
    console.log('✅ Health check passed:', result.message);
  }
};

const testUserRegistration = async () => {
  console.log('\n👤 Testing User Registration...');
  const result = await apiCall('POST', '/auth/register', testUser);
  if (result) {
    console.log('✅ User registered successfully:', result.data.user.username);
    return result.data.token;
  }
  return null;
};

const testUserLogin = async () => {
  console.log('\n🔐 Testing User Login...');
  const result = await apiCall('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  if (result) {
    console.log('✅ User logged in successfully:', result.data.user.username);
    return result.data.token;
  }
  return null;
};

const testCreatePost = async (token) => {
  console.log('\n📝 Testing Post Creation...');
  const result = await apiCall('POST', '/posts', testPost, token);
  if (result) {
    console.log('✅ Post created successfully:', result.data.post.title);
    return result.data.post._id;
  }
  return null;
};

const testGetPosts = async () => {
  console.log('\n📚 Testing Get Posts...');
  const result = await apiCall('GET', '/posts');
  if (result) {
    console.log('✅ Posts retrieved successfully:', result.data.posts.length, 'posts found');
  }
};

const testGetPost = async (postId) => {
  console.log('\n📖 Testing Get Single Post...');
  const result = await apiCall('GET', `/posts/${postId}`);
  if (result) {
    console.log('✅ Post retrieved successfully:', result.data.post.title);
  }
};

const testUpdatePost = async (postId, token) => {
  console.log('\n✏️ Testing Post Update...');
  const updateData = {
    title: 'Updated Post Title',
    content: 'This post has been updated with new content.',
    tags: ['updated', 'test', 'example']
  };
  const result = await apiCall('PUT', `/posts/${postId}`, updateData, token);
  if (result) {
    console.log('✅ Post updated successfully:', result.data.post.title);
  }
};

const testLikePost = async (postId, token) => {
  console.log('\n❤️ Testing Post Like...');
  const result = await apiCall('POST', `/posts/${postId}/like`, {}, token);
  if (result) {
    console.log('✅ Post liked successfully. Total likes:', result.data.likes);
  }
};

const testSearchPosts = async () => {
  console.log('\n🔍 Testing Post Search...');
  const result = await apiCall('GET', '/posts/search?q=test');
  if (result) {
    console.log('✅ Search completed successfully:', result.data.posts.length, 'posts found');
  }
};

const testGetUserProfile = async (token) => {
  console.log('\n👤 Testing Get User Profile...');
  const result = await apiCall('GET', '/auth/profile', null, token);
  if (result) {
    console.log('✅ User profile retrieved successfully:', result.data.user.fullName);
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');

  await testHealthCheck();
  
  let token = await testUserRegistration();
  
  if (!token) {
    token = await testUserLogin();
  }

  if (token) {
    const postId = await testCreatePost(token);
    
    // Test getting posts
    await testGetPosts();
    
    if (postId) {
      // Test getting single post
      await testGetPost(postId);
      
      // Test updating post
      await testUpdatePost(postId, token);
      
      // Test liking post
      await testLikePost(postId, token);
    }
    
    // Test search
    await testSearchPosts();
    
    // Test user profile
    await testGetUserProfile(token);
  }

  console.log('\n✨ API Tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  apiCall,
  testUser,
  testPost
}; 