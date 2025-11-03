# MERN Blog Application

A **full-stack MERN (MongoDB, Express.js, React.js, Node.js)** blog application that demonstrates seamless integration between front-end and back-end components — featuring user authentication, CRUD operations, image uploads, comments, pagination, and more.

---

## Project Overview

This application allows users to:
- Create, edit, and delete blog posts.
- Upload featured images for posts.
- Register, log in, and manage protected routes.
- Like and comment on posts.
- Browse posts by category with pagination and search filters.

It showcases best practices in **state management**, **API communication**, **form validation**, and **full-stack integration** with an emphasis on clean code and scalability.

---

## Features Implemented

✅ Authentication & Authorization

JWT-based login and registration.

Protected routes for creating/editing/deleting posts.

✅ CRUD Operations

Full Create, Read, Update, Delete functionality for posts and categories.

✅ Image Upload

Upload and display featured images using multer.

✅ Comments & Likes

Authenticated users can like posts and add comments.

✅ Pagination

Backend pagination with query parameters (?page=1&limit=10).

✅ Search & Filter

Filter posts by category or keyword.

✅ Optimistic UI Updates

Instant UI updates for post creation and likes before server confirmation.

✅ Validation & Error Handling

Client-side and server-side validation using Joi and custom middlewares.

✅ Responsive Design

Fully responsive layout using CSS or Tailwind (depending on your setup).

## Environment Variables Summary

- Variable        Description
- PORT	          Express server port
- MONGO_URI	      MongoDB connection string
- JWT_SECRET	    Secret for signing JWT tokens
- CLIENT_URL	    Frontend URL for CORS
- VITE_API_URL	  API base URL for React client

## 🖼️ Screenshot

![Post Form](./screenshots/post-form.png)