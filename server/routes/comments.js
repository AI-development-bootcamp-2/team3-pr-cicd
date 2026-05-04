const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { requireAuth } = require('../middleware/auth'); // Adjust path as needed

// Helper to format consistent error responses
const sendError = (res, code, message) => {
  return res.status(code).json({ error: true, message, code });
};

// @route   GET /api/posts/:postId/comments
// @desc    List comments for a post
// @access  Public
// Note: In an actual Express app, to use :postId in this file, you might mount this router at 
// `/api` and define the route as `/posts/:postId/comments`, or mount it at `/api/posts/:postId/comments`
// and use `express.Router({ mergeParams: true })`. Assuming `mergeParams: true` here.
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Fetch comments for the post, sorted chronologically (oldest first)
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate('author', 'username avatar'); // Include author's username and avatar

    res.json(comments);
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'Unexpected server-side failure');
  }
});

// @route   POST /api/posts/:postId/comments
// @desc    Add a comment
// @access  Private
router.post('/posts/:postId/comments', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parent } = req.body;

    if (!content || content.trim() === '') {
      return sendError(res, 400, 'Comment content is required');
    }

    const newComment = new Comment({
      content,
      author: req.user._id,
      post: postId,
      parent: parent || null
    });

    await newComment.save();
    
    // Populate author details before returning
    await newComment.populate('author', 'username avatar');

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'Unexpected server-side failure');
  }
});

// @route   PUT /api/comments/:id
// @desc    Edit own comment
// @access  Private
router.put('/comments/:id', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return sendError(res, 400, 'Comment content is required');
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return sendError(res, 404, 'Comment not found');
    }

    // Check ownership (or admin role)
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Authenticated but not allowed to edit this comment');
    }

    comment.content = content;
    await comment.save();
    
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'Unexpected server-side failure');
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete own comment
// @access  Private
router.delete('/comments/:id', requireAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return sendError(res, 404, 'Comment not found');
    }

    // Check ownership (or admin role)
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Authenticated but not allowed to delete this comment');
    }

    await comment.deleteOne();

    res.json({ message: 'Comment removed successfully' });
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'Unexpected server-side failure');
  }
});

module.exports = router;
