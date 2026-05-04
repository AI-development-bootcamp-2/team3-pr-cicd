# Forum Project — Minimal Spec

> **Scope:** Users · Posts · Comments

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | JWT or Sessions (team's choice) |

---

## 1. Users

### Must-Have Features
- Register (username, email, password)
- Login — returns auth token / session
- Logout
- View own profile
- Edit own profile (username, bio, avatar URL)
- Delete own account

### Data Model
```json
{
  "_id":       "ObjectId",
  "username":  "String (unique, required)",
  "email":     "String (unique, required)",
  "password":  "String (hashed, required)",
  "avatar":    "String (URL)",
  "bio":       "String",
  "role":      "String  // 'user' | 'admin'",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login, receive token | No |
| POST | `/api/auth/logout` | Invalidate session | Yes |
| GET | `/api/users/:id` | Get user profile | No |
| PUT | `/api/users/:id` | Edit own profile | Yes (own) |
| DELETE | `/api/users/:id` | Delete own account | Yes (own) |

### Business Rules
- Passwords must be stored hashed (bcrypt or equivalent).
- Email and username must be unique across the system.
- Users can only edit or delete their own account (unless admin).
- A deleted user's posts and comments remain, but author shows as `[deleted]`.

---

## 2. Posts

### Must-Have Features
- Create a post (title + content)
- View a single post
- Edit own post
- Delete own post
- List all posts (paginated feed)
- List posts by a specific user

### Data Model
```json
{
  "_id":       "ObjectId",
  "title":     "String (required)",
  "content":   "String (required)",
  "author":    "ObjectId (ref: User, required)",
  "category":  "String",
  "tags":      "[String]",
  "likes":     "[ObjectId] (ref: User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/posts` | List all posts (paginated) | No |
| GET | `/api/posts/:id` | Get a single post | No |
| POST | `/api/posts` | Create a new post | Yes |
| PUT | `/api/posts/:id` | Edit own post | Yes (own) |
| DELETE | `/api/posts/:id` | Delete own post | Yes (own) |
| GET | `/api/users/:id/posts` | List posts by user | No |

### Business Rules
- Title and content are required fields.
- Only the post author (or admin) can edit or delete a post.
- The feed endpoint must support pagination (`page` + `limit` query params).
- Post responses must include the author's username and avatar.

---

## 3. Comments

### Must-Have Features
- Add a comment to a post
- View all comments for a post
- Edit own comment
- Delete own comment

### Data Model
```json
{
  "_id":       "ObjectId",
  "content":   "String (required)",
  "author":    "ObjectId (ref: User, required)",
  "post":      "ObjectId (ref: Post, required)",
  "parent":    "ObjectId (ref: Comment)  // for nested replies",
  "likes":     "[ObjectId] (ref: User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/posts/:postId/comments` | List comments for a post | No |
| POST | `/api/posts/:postId/comments` | Add a comment | Yes |
| PUT | `/api/comments/:id` | Edit own comment | Yes (own) |
| DELETE | `/api/comments/:id` | Delete own comment | Yes (own) |

### Business Rules
- Content is a required field.
- Only the comment author (or admin) can edit or delete a comment.
- Comments must be returned in chronological order (oldest first).
- Comment responses must include the author's username and avatar.

---

## 4. Error Handling

All endpoints return a consistent JSON error shape:

```json
{ "error": true, "message": "Human-readable description", "code": 400 }
```

| Status | When to Use |
|--------|-------------|
| `400` | Missing or invalid input fields |
| `401` | Missing or invalid auth token |
| `403` | Authenticated but not allowed (e.g. editing another user's post) |
| `404` | Resource does not exist |
| `409` | Duplicate email or username on registration |
| `500` | Unexpected server-side failure |

---

## 5. CI Requirements

Every PR must pass a GitHub Actions workflow with these three stages:

- **Build** — app compiles / starts without errors.
- **Lint** — ESLint (or equivalent) reports zero errors.
- **Tests** — at least one test per endpoint group (auth, posts, comments).

A failing CI pipeline blocks the merge.

---

## 6. Folder Structure

```
forum-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/       # API calls
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── index.js
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── README.md
```

---

## 7. Development Workflow

- Each feature ships in its own Pull Request.
- CI must pass before a PR can be merged.
- The second team performs code review before merge.
- Document any intentional bugs in a private file (not committed to main).
