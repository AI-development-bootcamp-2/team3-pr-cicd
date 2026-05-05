const express = require('express');
const router  = express.Router();
const postController = require('../controllers/postController');

router.get('/:id/posts', postController.getByUser);

module.exports = router;
