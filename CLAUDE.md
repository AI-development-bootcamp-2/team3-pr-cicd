# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This repository is currently **spec-only**. The full specification lives in `forum_minimal_spec.md`. No implementation exists yet. The planned folder structure is:

```
forum-project/
├── client/          # React SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/ # API calls
│       └── App.jsx
├── server/          # Express API
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── index.js
└── .github/workflows/ci.yml
```

## Commands (once implemented)

From `client/`:
```
npm run dev       # start React dev server
npm run build     # production build
npm run lint      # ESLint (must pass CI)
npm test          # run tests
```

From `server/`:
```
npm run dev       # start Express with hot reload
npm start         # production start
npm run lint      # ESLint (must pass CI)
npm test          # run tests
npm test -- --grep "auth"   # run a single test group
```

CI runs three stages: **build → lint → tests**. All must pass before merge.

## Architecture

**Stack:** React (client) · Node.js + Express (server) · MongoDB · JWT or sessions

**Three core entities:** User, Post, Comment — all MongoDB documents with ObjectId refs between them.

**Auth pattern:** The team chooses JWT or sessions. Protected endpoints require auth; ownership-only endpoints require `req.user._id === resource.author` (or `role === 'admin'`).

**Soft-delete for users:** Deleting a user account does NOT cascade-delete their posts/comments. Instead, the author field shows as `[deleted]` in responses.

**Pagination:** `GET /api/posts` takes `?page=&limit=` query params.

## API Surface

Base path: `/api`

| Group | Endpoints |
|-------|-----------|
| Auth | POST `/auth/register`, POST `/auth/login`, POST `/auth/logout` |
| Users | GET/PUT/DELETE `/users/:id` |
| Posts | GET/POST `/posts`, GET/PUT/DELETE `/posts/:id`, GET `/users/:id/posts` |
| Comments | GET/POST `/posts/:postId/comments`, PUT/DELETE `/comments/:id` |

**Error shape** (all endpoints):
```json
{ "error": true, "message": "...", "code": 400 }
```
Status codes: 400 bad input · 401 missing/invalid auth · 403 forbidden · 404 not found · 409 duplicate email/username · 500 server error.

## Key Business Rules

- Passwords hashed with bcrypt (or equivalent); never stored plain.
- Email and username must be unique — registration returns 409 on conflict.
- Post and comment responses must include `author.username` and `author.avatar` (populate/join required).
- Comments returned oldest-first.
- Only the resource owner or an admin may edit/delete a post or comment.


