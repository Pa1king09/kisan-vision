import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, ThumbsUp, Eye, ChevronDown, Loader2, Search, Plus, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { getActiveApiUrl } from '../utils/mobileInit';

const API = getActiveApiUrl();
const CATEGORIES = ['all', 'pest', 'soil', 'weather', 'market', 'scheme', 'general'];
const CATEGORY_COLORS = {
  pest: 'bg-red-500/10 text-red-400 border-red-500/20',
  soil: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  weather: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  market: 'bg-green-500/10 text-green-400 border-green-500/20',
  scheme: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  general: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};
const EMOJIS = { pest: '🪲', soil: '🌱', weather: '🌦️', market: '💰', scheme: '🏛️', general: '💬' };

function timeAgo(date) {
  const secs = Math.floor((new Date() - new Date(date)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', crop_tag: '', author: '' });
  const [submitting, setSubmitting] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [answers, setAnswers] = useState({});
  const [newAnswer, setNewAnswer] = useState('');
  const [answerAuthor, setAnswerAuthor] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await axios.get(`${API}/forum/posts`, { params });
      setPosts(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch { toast.error('Failed to load posts'); }
    finally { setLoading(false); }
  };

  const fetchAnswers = async (postId) => {
    try {
      const res = await axios.get(`${API}/forum/posts/${postId}/answers`);
      setAnswers(a => ({ ...a, [postId]: res.data.data }));
    } catch {}
  };

  useEffect(() => { fetchPosts(); }, [category, page, search]);

  const handleExpandPost = async (post) => {
    if (expandedPost?._id === post._id) { setExpandedPost(null); return; }
    setExpandedPost(post);
    fetchAnswers(post._id);
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`${API}/forum/posts/${postId}/like`);
      setPosts(p => p.map(post => post._id === postId ? { ...post, likes: res.data.data.likes } : post));
    } catch {}
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) { toast.error('Title and content are required'); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/forum/posts`, { ...newPost, author: newPost.author || 'Anonymous Farmer' });
      toast.success('Question posted!');
      setShowForm(false);
      setNewPost({ title: '', content: '', category: 'general', crop_tag: '', author: '' });
      fetchPosts();
    } catch { toast.error('Failed to post. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const handleSubmitAnswer = async (postId) => {
    if (!newAnswer.trim()) { toast.error('Answer cannot be empty'); return; }
    try {
      const res = await axios.post(`${API}/forum/posts/${postId}/answers`, {
        content: newAnswer, author: answerAuthor || 'Anonymous Farmer'
      });
      setAnswers(a => ({ ...a, [postId]: [res.data.data, ...(a[postId] || [])] }));
      setPosts(p => p.map(post => post._id === postId ? { ...post, answers: post.answers + 1 } : post));
      setNewAnswer(''); setAnswerAuthor('');
      toast.success('Answer posted!');
    } catch { toast.error('Failed to post answer'); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-400 text-sm mb-4">
            <Users size={14} /> Community Forum
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Farmer Community Forum</h1>
          <p className="text-gray-400">Ask questions, share knowledge, learn from fellow farmers</p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${category === cat ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600'}`}>
                {EMOJIS[cat] || '🔍'} {cat}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-all">
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Cancel' : 'Ask Question'}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-500" size={16} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search questions..." className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        {/* New Post Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/50 border border-green-500/30 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-white mb-4">Ask a Question</h3>
              <form onSubmit={handleSubmitPost} className="space-y-3">
                <input value={newPost.author} onChange={e => setNewPost(f => ({ ...f, author: e.target.value }))}
                  placeholder="Your name (optional)" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500" />
                <input value={newPost.title} onChange={e => setNewPost(f => ({ ...f, title: e.target.value }))}
                  placeholder="Question title *" required className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500" />
                <textarea value={newPost.content} onChange={e => setNewPost(f => ({ ...f, content: e.target.value }))}
                  placeholder="Describe your problem in detail..." required rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500 resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select value={newPost.category} onChange={e => setNewPost(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 appearance-none focus:outline-none focus:border-green-500">
                      {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c} className="capitalize">{EMOJIS[c]} {c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-500" size={13} />
                  </div>
                  <input value={newPost.crop_tag} onChange={e => setNewPost(f => ({ ...f, crop_tag: e.target.value }))}
                    placeholder="Crop tag (e.g., rice)" className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />} Post Question
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-400" size={32} /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
            <MessageSquare className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-500">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-800/50 border rounded-xl overflow-hidden transition-all ${expandedPost?._id === post._id ? 'border-green-500/30' : 'border-gray-700/50'}`}>
                <button onClick={() => handleExpandPost(post)} className="w-full text-left p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general}`}>
                          {EMOJIS[post.category]} {post.category}
                        </span>
                        {post.crop_tag && <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{post.crop_tag}</span>}
                        {post.is_answered && <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">✓ Answered</span>}
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">{post.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>👤 {post.author}</span>
                    <span className="flex items-center gap-1"><ThumbsUp size={11} /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={11} /> {post.answers}</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {post.views}</span>
                    <span className="ml-auto">{timeAgo(post.createdAt)}</span>
                  </div>
                </button>

                {/* Expanded */}
                {expandedPost?._id === post._id && (
                  <div className="border-t border-gray-700/50 p-4 space-y-4">
                    <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>
                    <button onClick={() => handleLike(post._id)}
                      className="flex items-center gap-2 text-xs px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-400 hover:text-green-400 transition-all">
                      <ThumbsUp size={12} /> {post.likes} Helpful
                    </button>

                    {/* Answers */}
                    {answers[post._id]?.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-400">{answers[post._id].length} Answer(s)</div>
                        {answers[post._id].map(ans => (
                          <div key={ans._id} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-3">
                            <p className="text-sm text-gray-300">{ans.content}</p>
                            <div className="text-xs text-gray-500 mt-2">— {ans.author} · {timeAgo(ans.createdAt)}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Answer */}
                    <div className="space-y-2">
                      <input value={answerAuthor} onChange={e => setAnswerAuthor(e.target.value)}
                        placeholder="Your name (optional)" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-green-500" />
                      <div className="flex gap-2">
                        <textarea value={newAnswer} onChange={e => setNewAnswer(e.target.value)}
                          placeholder="Write your answer..." rows={2}
                          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-green-500 resize-none" />
                        <button onClick={() => handleSubmitAnswer(post._id)}
                          className="px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1">
                          <Send size={12} /> Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm transition-all ${page === i + 1 ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
