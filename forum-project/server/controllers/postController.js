const Post = require('../models/Post');

const getAll = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const filter = { ...req.query };
    delete filter.page;
    delete filter.limit;

    const [posts, total] = await Promise.all([
      Post.find(filter).skip(skip).limit(limit).populate('author'),
      Post.countDocuments(filter),
    ]);

    res.json({ posts, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, stack: err.stack, code: 500 });
  }
};

const getById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');
    if (!post) return res.status(404).json({ error: true, message: 'Post not found', code: 404 });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, stack: err.stack, code: 500 });
  }
};

const create = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user._id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, stack: err.stack, code: 500 });
  }
};

const update = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('author');
    if (!post) return res.status(404).json({ error: true, message: 'Post not found', code: 404 });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, stack: err.stack, code: 500 });
  }
};

const remove = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: true, message: 'Post not found', code: 404 });

    if (post.author.toString() !== req.user._id) {
      return res.status(403).json({ error: true, message: 'Forbidden', code: 403 });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, stack: err.stack, code: 500 });
  }
};

const getByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id }).populate('author');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, stack: err.stack, code: 500 });
  }
};

module.exports = { getAll, getById, create, update, remove, getByUser };
