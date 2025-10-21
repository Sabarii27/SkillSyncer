import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  EyeIcon,
  BookmarkIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // Fallback to mock user
        setCurrentUser({ id: 1, name: 'Current User', avatar: null });
      }
    };
    fetchCurrentUser();
  }, []);

  const categories = {
    all: { label: 'All Posts', color: 'gray' },
    discussion: { label: 'Discussion', color: 'blue' },
    question: { label: 'Questions', color: 'green' },
    showcase: { label: 'Showcase', color: 'purple' },
    career: { label: 'Career', color: 'orange' },
    resources: { label: 'Resources', color: 'indigo' }
  };

  useEffect(() => {
    loadPosts();
  }, [activeFilter, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/community/posts', {
        params: { category: activeFilter, search: searchQuery }
      });
  setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Generate mock data for development
      generateMockPosts();
    } finally {
      setLoading(false);
    }
  };

  const generateMockPosts = () => {
    const mockPosts = [
      {
        id: 1,
        title: "How to transition from frontend to full-stack development?",
        content: "I've been working as a frontend developer for 2 years and want to expand my skills to backend. What's the best learning path?",
        category: "career",
        author: {
          id: 2,
          name: "Sarah Chen",
          avatar: null,
          title: "Frontend Developer"
        },
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-15T10:30:00'),
        likes: 15,
        comments: 8,
        views: 142,
        isLiked: false,
        isBookmarked: false,
        tags: ["career", "fullstack", "backend"]
      },
      {
        id: 2,
        title: "Built my first React portfolio website!",
        content: "Just finished my portfolio using React, Tailwind CSS, and Framer Motion. It took me 3 weeks but I learned so much! Check it out and let me know what you think.",
        category: "showcase",
        author: {
          id: 3,
          name: "Mike Rodriguez",
          avatar: null,
          title: "Junior Developer"
        },
        createdAt: new Date('2024-01-14T15:45:00'),
        updatedAt: new Date('2024-01-14T15:45:00'),
        likes: 32,
        comments: 12,
        views: 89,
        isLiked: true,
        isBookmarked: true,
        tags: ["react", "portfolio", "tailwind"]
      },
      {
        id: 3,
        title: "Free resources for learning Data Structures and Algorithms",
        content: "Compiled a list of the best free resources I used to prepare for technical interviews:\n\n1. LeetCode (obvious but essential)\n2. AlgoExpert (has free content)\n3. CS50 Introduction to Computer Science\n4. Cracking the Coding Interview book\n5. YouTube channels: Abdul Bari, Back To Back SWE",
        category: "resources",
        author: {
          id: 4,
          name: "Alex Thompson",
          avatar: null,
          title: "Software Engineer"
        },
        createdAt: new Date('2024-01-13T09:15:00'),
        updatedAt: new Date('2024-01-13T09:15:00'),
        likes: 78,
        comments: 25,
        views: 234,
        isLiked: false,
        isBookmarked: false,
        tags: ["algorithms", "interview", "resources"]
      },
      {
        id: 4,
        title: "Should I learn Python or JavaScript first?",
        content: "I'm completely new to programming and trying to decide between Python and JavaScript as my first language. I'm interested in both web development and data science. What would you recommend?",
        category: "question",
        author: {
          id: 5,
          name: "Emma Wilson",
          avatar: null,
          title: "Aspiring Developer"
        },
        createdAt: new Date('2024-01-12T14:20:00'),
        updatedAt: new Date('2024-01-12T14:20:00'),
        likes: 23,
        comments: 35,
        views: 187,
        isLiked: false,
        isBookmarked: true,
        tags: ["python", "javascript", "beginner"]
      },
      {
        id: 5,
        title: "My experience at a FAANG interview",
        content: "Just completed the interview process at Google and wanted to share my experience. The process was intense but fair. Happy to answer any questions about preparation and what to expect.",
        category: "discussion",
        author: {
          id: 6,
          name: "David Park",
          avatar: null,
          title: "Senior Software Engineer"
        },
        createdAt: new Date('2024-01-11T16:30:00'),
        updatedAt: new Date('2024-01-11T16:30:00'),
        likes: 156,
        comments: 67,
        views: 892,
        isLiked: true,
        isBookmarked: false,
        tags: ["interview", "faang", "experience"]
      }
    ];

    const filteredPosts = mockPosts.filter(post => {
      const matchesCategory = activeFilter === 'all' || post.category === activeFilter;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });

    setPosts(filteredPosts);
  };

  const createPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const response = await axios.post('/api/community/posts', {
        ...newPost,
        authorId: currentUser.id
      });
      
      // Add to posts list
      setPosts(prev => [response.data, ...prev]);
      
    } catch (error) {
      console.error('Failed to create post:', error);
      // Mock post creation
      const mockPost = {
        id: Date.now(),
        ...newPost,
        author: currentUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        comments: 0,
        views: 0,
        isLiked: false,
        isBookmarked: false,
        tags: []
      };
      setPosts(prev => [mockPost, ...prev]);
    }

    setNewPost({ title: '', content: '', category: 'discussion' });
    setShowCreatePost(false);
  };

  const toggleLike = async (postId) => {
    try {
      await axios.post(`/api/community/posts/${postId}/like`);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const toggleBookmark = async (postId) => {
    try {
      await axios.post(`/api/community/posts/${postId}/bookmark`);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const openPostDetail = async (post) => {
    setSelectedPost(post);
    
    // First, try to get the full post with comments from the backend
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/community/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data.comments) {
        setComments(response.data.data.comments);
      } else {
        // Use comments from the post data if available
        setComments(post.comments || []);
      }
    } catch (error) {
      console.error('Failed to load post details:', error);
      
      // Fallback to post comments or mock comments
      if (post.comments && Array.isArray(post.comments)) {
        setComments(post.comments);
      } else {
        // Mock comments as final fallback
        const mockComments = [
          {
            id: 1,
            content: "Great question! I made a similar transition last year. Here's what worked for me...",
            author: {
              id: 7,
              name: "Jane Smith",
              avatar: null,
              title: "Full Stack Developer"
            },
            createdAt: new Date('2024-01-15T11:00:00'),
            likes: 5,
            isLiked: false
          },
          {
            id: 2,
            content: "I'd recommend starting with Node.js and Express if you're already comfortable with JavaScript.",
            author: {
              id: 8,
              name: "John Doe",
              avatar: null,
              title: "Backend Developer"
            },
            createdAt: new Date('2024-01-15T12:30:00'),
            likes: 3,
            isLiked: true
          }
        ];
        setComments(mockComments);
      }
    }

    // Increment view count
    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    ));
  };

  const addComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/community/posts/${selectedPost.id}/comments`, {
        text: newComment  // Backend expects 'text', not 'content'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Reload comments to get the updated post with new comment
      if (response.data.success) {
        const updatedPost = response.data.data;
        setComments(updatedPost.comments || []);
        
        // Update posts list with new comment count
        setPosts(prev => prev.map(post => 
          post.id === selectedPost.id 
            ? { ...post, comments: updatedPost.comments.length }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Mock comment as fallback
      const mockComment = {
        id: Date.now(),
        text: newComment,
        userId: currentUser,
        createdAt: new Date(),
        likes: 0,
        isLiked: false
      };
      setComments(prev => [...prev, mockComment]);
      
      // Update comment count
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
    }

    setNewComment('');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getCategoryColor = (category) => {
    const colors = categories[category]?.color || 'gray';
    return {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      gray: 'bg-gray-100 text-gray-800'
    }[colors];
  };

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
            {post.author?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{post.author?.name || 'Unknown User'}</div>
            <div className="text-sm text-gray-600">{post.author?.title || 'Community Member'}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
            {categories[post.category]?.label}
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
          onClick={() => openPostDetail(post)}
        >
          {post.title}
        </h3>
        <p className="text-gray-700 line-clamp-3">{post.content}</p>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <CalendarDaysIcon className="h-4 w-4 mr-1" />
            {formatTimeAgo(post.createdAt)}
          </span>
          <span className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            {post.views}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
              post.isLiked 
                ? 'bg-red-50 text-red-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {post.isLiked ? (
              <HeartSolidIcon className="h-4 w-4" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
            <span className="text-sm">{post.likes}</span>
          </button>

          <button
            onClick={() => openPostDetail(post)}
            className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChatBubbleLeftIcon className="h-4 w-4" />
            <span className="text-sm">{post.comments}</span>
          </button>

          <button
            onClick={() => toggleBookmark(post.id)}
            className={`p-1 rounded transition-colors ${
              post.isBookmarked 
                ? 'text-yellow-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {post.isBookmarked ? (
              <BookmarkSolidIcon className="h-4 w-4" />
            ) : (
              <BookmarkIcon className="h-4 w-4" />
            )}
          </button>

          <button className="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors">
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const PostDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedPost.author?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{selectedPost.author?.name || 'Unknown User'}</div>
                <div className="text-sm text-gray-600">{selectedPost.author?.title || 'Community Member'}</div>
                <div className="text-sm text-gray-500">{formatTimeAgo(selectedPost.createdAt)}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedPost(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2">{selectedPost.title}</h2>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedPost.category)}`}>
            {categories[selectedPost.category]?.label}
          </span>
        </div>

        <div className="p-6">
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
          </div>

          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedPost.tags.map((tag, index) => (
                <span key={index} className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({comments.length})
            </h3>

            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Write a comment..."
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id || comment._id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {(comment.author?.name || comment.userId?.name || 'U').charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {comment.author?.name || comment.userId?.name || 'Unknown User'}
                        </span>
                        <span className="text-gray-500 text-xs">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content || comment.text}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 ml-3">
                      <button
                        onClick={() => {}}
                        className={`flex items-center space-x-1 text-xs ${
                          comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {comment.isLiked ? (
                          <HeartSolidIcon className="h-3 w-3" />
                        ) : (
                          <HeartIcon className="h-3 w-3" />
                        )}
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Community</h2>
          <p className="text-gray-600">Connect with fellow learners and share your journey</p>
        </div>
        
        <button
          onClick={() => setShowCreatePost(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-4 sm:mt-0"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Post
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, tags, or users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-2">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
  ) : !Array.isArray(posts) || posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No posts found</div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="text-blue-500 hover:text-blue-600"
          >
            Be the first to share something!
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(categories).slice(1).map(([key, category]) => (
                    <option key={key} value={key}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="What's your post about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Share your thoughts, questions, or resources..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createPost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && <PostDetailModal />}
    </div>
  );
};

export default Community;