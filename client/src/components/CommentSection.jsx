import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';
import { authService } from '../services/authService';

const CommentSection = ({ reportId, comments, onCommentsUpdate }) => {
  const { user, isAuthenticated } = useApp();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await reportService.addComment(reportId, newComment.trim());
      setNewComment('');
      onCommentsUpdate();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await reportService.updateComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent('');
      onCommentsUpdate();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await reportService.deleteComment(commentId);
        onCommentsUpdate();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEditComment = (comment) => {
    return user && (user.id === comment.user._id || authService.isAdmin());
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>

      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
            className="comment-textarea"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.user?.name || 'Anonymous'}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>

              {editingComment === comment._id ? (
                <div className="comment-edit">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="3"
                    className="comment-textarea"
                  />
                  <div className="comment-edit-actions">
                    <button 
                      onClick={() => handleEditComment(comment._id)}
                      className="btn btn-primary btn-sm"
                      disabled={!editContent.trim()}
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="comment-content">
                  <p>{comment.content}</p>
                  {canEditComment(comment) && (
                    <div className="comment-actions">
                      <button 
                        onClick={() => startEdit(comment)}
                        className="btn-link"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn-link delete"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;