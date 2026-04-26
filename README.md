# Sproutly

Sproutly is a full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js). 

## Tech Stack
- **Frontend**: React (v19) with Vite, Tailwind CSS, Zustand for state management, Tiptap Editor for rich text, and Socket.io-client.
- **Backend**: Node.js, Express.js, MongoDB using Mongoose, Socket.io for real-time features, Cloudinary for image uploads, and JWT for authentication.

## Features
- Rich text post creation using Tiptap editor
- Real-time communication powered by Socket.io
- Secure image uploads with Cloudinary
- Token-based Authentication
- Advanced search capabilities using MongoDB Atlas Search
- Brute-force protection with login rate limiting using express-rate-limit

## Future Goals
- [ ] **Cursor Pagination**: Implement cursor-based pagination for more efficient data fetching on feeds.
- [ ] **Chat Section**: Build real-time one-on-one and group messaging functionality.
- [ ] **Nested Comments**: Allow users to reply to specific comments to build threaded conversations.
- [ ] **Form Validation**: Incorporate robust client-side and server-side form validation mechanisms.
- [ ] **OAuth2 Integration**: Support third-party logins (e.g., Google, GitHub).
- [ ] **Email Verification**: Add account verification via email to ensure account authenticity.
- [ ] **CSRF Protection**: Strengthen security by adding Cross-Site Request Forgery protection.

## Getting Started

### Prerequisites
- Node.js
- MongoDB connection string
- Cloudinary account

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/sayan-ay/Sproutly.git
cd Sproutly
```

2. **Install Server dependencies:**
```bash
cd Server
npm install
```

3. **Install Client dependencies:**
```bash
cd ../Client
npm install
```

### Setup Environment Variables

Create an `.env` file in the `Server` directory and add the required environment variables:
```env
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Running the Application

Start the backend server:
```bash
cd Server
npm start
```

Start the frontend development server:
```bash
cd Client
npm run dev
```
