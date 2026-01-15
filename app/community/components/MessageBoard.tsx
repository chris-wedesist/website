"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import supabase from "../../../utils/supabase";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { moderateContent } from '../../../utils/contentModeration';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  user_id: string;
  created_at: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderation_reason?: string;
  like_count: number;
  users: {
    email: string;
    full_name: string | null;
    username: string | null;
  };
}

// interface Comment {
//   id: number;
//   content: string;
//   created_at: string;
//   user_id: string;
//   users: {
//     email: string;
//     full_name: string | null;
//     username: string | null;
//   };
// }

const CATEGORIES = [
  { id: 'support', name: 'Support Groups', color: 'blue', bgClass: 'bg-blue-100 dark:bg-blue-900/30', textClass: 'text-blue-800 dark:text-blue-300', selectedBgClass: 'bg-blue-600' },
  { id: 'resources', name: 'Resource Sharing', color: 'purple', bgClass: 'bg-purple-100 dark:bg-purple-900/30', textClass: 'text-purple-800 dark:text-purple-300', selectedBgClass: 'bg-purple-600' },
  { id: 'stories', name: 'Success Stories', color: 'pink', bgClass: 'bg-pink-100 dark:bg-pink-900/30', textClass: 'text-pink-800 dark:text-pink-300', selectedBgClass: 'bg-pink-600' },
  { id: 'updates', name: 'Community Updates', color: 'green', bgClass: 'bg-green-100 dark:bg-green-900/30', textClass: 'text-green-800 dark:text-green-300', selectedBgClass: 'bg-green-600' }
];

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
              username: username
            }
          },
        });
        if (error) throw error;
        // alert("Registration successful! Please check your email to verify your account.");
      }
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserMenu = ({ user, onLogout }: { user: SupabaseUser | null; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await onLogout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          {user?.email?.[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {user?.email}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Signed in as</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MessageBoard = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  // const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Ensure user exists in users table
        ensureUserExists(session.user);
        // Fetch user's liked posts
        fetchUserLikes(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Ensure user exists in users table
        await ensureUserExists(session.user);
        // Fetch user's liked posts
        await fetchUserLikes(session.user.id);
      } else {
        // Clear liked posts when user logs out
        setLikedPosts(new Set());
      }
    });

    // Fetch posts
    fetchPosts();

    // Set up real-time subscription for new posts
    const postsSubscription = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, 
        (payload) => {
          setPosts(current => [payload.new as Post, ...current]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      postsSubscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!inner (
            email,
            full_name,
            username
          ),
          post_likes (
            id
          )
        `)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform the data to include like_count
      const transformedPosts = data.map(post => ({
        ...post,
        like_count: post.post_likes?.length || 0
      }));

      setPosts(transformedPosts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const ensureUserExists = async (user: SupabaseUser) => {
    try {
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // If user doesn't exist, insert them
        const { error } = await supabase
          .from('users')
          .insert({ 
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            username: user.user_metadata?.username || null
          });

        if (error) {
          console.error('Error inserting user:', error);
          // If insert fails, try update
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              email: user.email,
              full_name: user.user_metadata?.full_name || null,
              username: user.user_metadata?.username || null
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating user:', updateError);
          }
        }
      }
    } catch (error) {
      console.error('Error ensuring user exists:', error);
    }
  };

  const fetchUserLikes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId);

      if (error) throw error;
      
      // Create a Set of liked post IDs
      const likedPostIds = new Set(data.map(like => like.post_id));
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Moderate the content first
      const moderationResult = await moderateContent(newPost.content);
      
      if (!moderationResult.isAppropriate) {
        alert(`Your post contains inappropriate content: ${moderationResult.reason}`);
        return;
      }

      // First ensure user exists in users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({ 
          id: user.id,
          email: user.email
        });

      if (userError) throw userError;

      // Then create the post with moderation status
      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            title: newPost.title.trim(),
            content: newPost.content.trim(),
            category: newPost.category,
            user_id: user.id,
            moderation_status: 'pending'
          }
        ]);

      if (postError) throw postError;
      
      setNewPost({ title: '', content: '', category: '' });
      setShowNewPostForm(false);
      alert('Your post has been submitted and is pending moderation. It will be visible once approved.');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNewPostClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowNewPostForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async (postId: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const isCurrentlyLiked = likedPosts.has(postId);

      // Optimistically update UI
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });

      // Update posts with optimistic like count
      setPosts(current =>
        current.map(post =>
          post.id === postId
            ? {
                ...post,
                like_count: isCurrentlyLiked
                  ? Math.max(0, post.like_count - 1) // Ensure we don't go below 0
                  : post.like_count + 1
              }
            : post
        )
      );

      if (isCurrentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user.id }]);

        if (error) throw error;
      }

      // Refresh the post to get accurate like count
      const { data: updatedPost, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          post_likes (
            id
          )
        `)
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;

      // Update the post with accurate like count
      setPosts(current =>
        current.map(post =>
          post.id === postId
            ? {
                ...post,
                like_count: updatedPost.post_likes?.length || 0
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (likedPosts.has(postId)) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });

      // Refresh the post to get accurate like count
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          post_likes (
            id
          )
        `)
        .eq('id', postId)
        .single();

      if (!fetchError && post) {
        setPosts(current =>
          current.map(p =>
            p.id === postId
              ? {
                  ...p,
                  like_count: post.post_likes?.length || 0
                }
              : p
          )
        );
      }
    }
  };

  const handlePostClick = (postId: number) => {
    router.push(`/community/post/${postId}`);
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (loading) {
    return (
      <section>
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-t-4 border-b-4 border-gray-900 dark:border-white rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Community Forum
          </h2>
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={handleNewPostClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {showNewPostForm ? 'Cancel' : 'New Post'}
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            All Topics
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                selectedCategory === category.id
                  ? `${category.selectedBgClass} text-white`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Post Title"
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post..."
                  rows={4}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Post
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center"
            >
              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                No Posts Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedCategory === 'all' 
                  ? "Be the first to start a conversation in the community!"
                  : `No posts in ${CATEGORIES.find(c => c.id === selectedCategory)?.name} yet.`}
              </p>
              {user ? (
                <button
                  onClick={() => setShowNewPostForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create First Post
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In to Post
                </button>
              )}
            </motion.div>
          ) : (
            filteredPosts.map((post) => {
              const category = CATEGORIES.find(c => c.id === post.category);
              const displayName = post.users?.username || post.users?.full_name || post.users?.email;
              const isLiked = likedPosts.has(post.id);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 px-6 cursor-pointer hover:shadow-2xl transition-shadow"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${category?.bgClass} ${category?.textClass}`}>
                        {category?.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {displayName}
                      </span>
                      {post.users?.username && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          @{post.users.username}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Like and Comment buttons */}
                  <div className="flex items-center gap-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        isLiked
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {post.like_count} {post.like_count === 1 ? 'Like' : 'Likes'}
                    </button>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {/* {comments[post.id]?.length || 0} Comments */}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
}; 