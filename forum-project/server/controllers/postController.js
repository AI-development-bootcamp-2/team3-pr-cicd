const Post = require('../models/Post');

const getAll = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().skip(skip).limit(limit).populate('author', 'username avatar'),
      Post.countDocuments(),
    ]);

    res.json({ posts, page, limit, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

const getById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username avatar');
    if (!post) return res.status(404).json({ error: true, message: 'Post not found', code: 404 });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

const create = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: true, message: 'Title and content are required', code: 400 });
    }

    const post = new Post({ title, content, category, tags, author: req.user._id });
    await post.save();
    await post.populate('author', 'username avatar');
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

const update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: true, message: 'Post not found', code: 404 });

    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Forbidden', code: 403 });
    }

    const { title, content, category, tags } = req.body;
    if (title    !== undefined) post.title    = title;
    if (content  !== undefined) post.content  = content;
    if (category !== undefined) post.category = category;
    if (tags     !== undefined) post.tags     = tags;

    await post.save();
    await post.populate('author', 'username avatar');
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

const remove = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: true, message: 'Post not found', code: 404 });

    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Forbidden', code: 403 });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

const getByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id }).populate('author', 'username avatar');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

module.exports = { getAll, getById, create, update, remove, getByUser };
