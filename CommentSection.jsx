import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './CommentSection.css';

const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/${blogId}`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please login to comment! 🔑');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`/api/comments/${blogId}`, {
        content: newComment.trim()
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setNewComment('');
        toast.success('Comment added! 💬');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setComments(comments.filter(comment => comment._id !== commentId));
        toast.success('Comment deleted! 🗑️');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>💬 Comments ({comments.length})</h3>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="comment-input-section">
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span className="avatar-placeholder">
                  {user?.name?.charAt(0) || '👤'}
                </span>
              )}
            </div>
            <div className="comment-input-wrapper">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this post..."
                className="comment-input"
                rows="3"
                maxLength="1000"
              />
              <div className="comment-actions">
                <span className="character-count">
                  {newComment.length}/1000
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="btn btn-primary btn-sm"
                >
                  {submitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <span>💬</span>
                      <span>Post Comment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <div className="login-prompt-content">
            <span>🔑</span>
            <p>Please <a href="/login">login</a> to join the conversation!</p>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">
            <div className="loading-spinner"></div>
            <span>Loading comments...</span>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-avatar">
                {comment.author?.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.name} />
                ) : (
                  <span className="avatar-placeholder">
                    {comment.author?.name?.charAt(0) || '👤'}
                  </span>
                )}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.author?.name || 'Anonymous'}
                  </span>
                  <span className="comment-date">
                    📅 {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  {user && comment.author && user._id === comment.author._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="comment-delete-btn"
                      title="Delete comment"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">
            <div className="no-comments-icon">💭</div>
            <h4>No comments yet</h4>
            <p>Be the first to share your thoughts about this post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
