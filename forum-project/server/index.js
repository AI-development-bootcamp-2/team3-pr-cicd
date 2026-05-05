const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/forum');

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
