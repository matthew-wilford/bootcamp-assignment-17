# DevLink API v1.0 🚀

### Codeacademy Full-Stack Bootcamp — NoSQL Backend Project

---

## Overview

**DevLink v1.0** is a lightweight professional networking backend built with:

- Node.js
- Express.js
- MongoDB
- Mongoose ODM

DevLink allows developers to:

- Create professional profiles
- Publish short career-focused posts
- Connect with other developers
- React to posts

This project focuses on real-world backend architecture using NoSQL document modeling, references, subdocuments, virtual fields, and relational-style data in MongoDB.

---

## Tech Stack

- Express.js
- MongoDB
- Mongoose
- Node.js
- Insomnia/Postman for testing

---

## Project Structure

```
devlink/
│
├── config/
│   └── connection.js
│
├── controllers/
│   ├── developerController.js
│   └── postController.js
│
├── models/
│   ├── Developer.js
│   ├── Post.js
│   └── Reaction.js
│
├── routes/
│   ├── api/
│   │   ├── developerRoutes.js
│   │   ├── postRoutes.js
│   │   └── index.js
│   └── index.js
│
├── server.js
├── package.json
└── README.md
```

---

## Models

---

### Developer

Represents a professional on the DevLink platform.

**Fields**

- `username` (String, required, unique, trimmed)
- `email` (String, required, unique, validated format)
- `headline` (String, optional)
- `skills` (Array of Strings)
- `posts` (Array of ObjectId references to Post)
- `connections` (Array of ObjectId references to Developer)

**Virtuals**

- `connectionCount`
- `postCount`

---

### Post

Represents a professional post shared by a developer.

**Fields**

- `content` (String, required, 1–300 characters)
- `createdAt` (Date, default = Date.now, formatted getter)
- `authorUsername` (String, required)
- `reactions` (Array of Reaction subdocuments)

**Virtuals**

- `reactionCount`

Posts return sorted newest first.

---

### Reaction (Subdocument Schema Only)

Reactions are embedded within posts.

**Fields**

- `reactionId` (ObjectId, default new ObjectId)
- `reactionBody` (String, max 200)
- `username` (String, required)
- `createdAt` (Date, formatted getter)

---

## API Routes

---

### `/api/developers`

| Method | Route                          | Description                                      |
| ------ | ------------------------------ | ------------------------------------------------ |
| GET    | `/api/developers`              | Get all developers                               |
| GET    | `/api/developers/:developerId` | Get one developer (populate posts + connections) |
| POST   | `/api/developers`              | Create a developer                               |
| PUT    | `/api/developers/:developerId` | Update a developer                               |
| DELETE | `/api/developers/:developerId` | Delete a developer                               |

---

### `/api/developers/:developerId/connections/:connectionId`

| Method | Description         |
| ------ | ------------------- |
| POST   | Add a connection    |
| DELETE | Remove a connection |

---

### `/api/posts`

| Method | Route                | Description                                |
| ------ | -------------------- | ------------------------------------------ |
| GET    | `/api/posts`         | Get all posts (newest first)               |
| GET    | `/api/posts/:postId` | Get one post                               |
| POST   | `/api/posts`         | Create a post and associate with developer |
| PUT    | `/api/posts/:postId` | Update a post                              |
| DELETE | `/api/posts/:postId` | Delete a post                              |

---

### `/api/posts/:postId/reactions`

| Method | Description                   |
| ------ | ----------------------------- |
| POST   | Add reaction                  |
| DELETE | Remove reaction by reactionId |

---

## Example Requests

### Create Developer

```json
POST /api/developers

{
  "username": "ada",
  "email": "ada@devlink.io",
  "headline": "Full-Stack Developer | React | Node",
  "skills": ["JavaScript", "MongoDB", "React"]
}
```

---

### Create Post

```json
POST /api/posts

{
  "content": "Just shipped my first full-stack project!",
  "authorUsername": "ada",
  "developerId": "PUT_OBJECT_ID_HERE"
}
```

---

### Add Reaction

```json
POST /api/posts/:postId/reactions

{
  "reactionBody": "Congrats! 🚀",
  "username": "grace"
}
```

---

## Validation & Standards

- All update routes use `runValidators: true`
- 404 returned for missing resources
- 400 returned for validation errors
- 500 returned for server errors
- JSON responses use consistent format

Example success response:

```json
{
  "success": true,
  "data": {}
}
```

Example error response:

```json
{
  "success": false,
  "message": "Developer not found"
}
```

---

## Learning Objectives

By completing this project, students will demonstrate:

- Mongoose schema modeling
- Subdocuments
- References and population
- Virtual fields
- CRUD architecture
- Proper error handling
- RESTful API design

---

## DevLink v1.0 Philosophy

Keep it simple.
Keep it professional.
Ship working software.

---

