# School Backend API

A RESTful backend API for a school management platform, built with Node.js, Express 5, MongoDB, and Cloudinary.

## Features

- **JWT Authentication** — Stateless token-based auth with bcrypt password hashing
- **Image Gallery** — Upload, view, and delete images via Cloudinary CDN with auto-compression
- **Notice Board** — Create, read, and delete school notices
- **Security** — Helmet headers, rate limiting, NoSQL injection sanitization, CORS whitelist
- **Pagination** — Paginated responses for images and notices

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | Server framework |
| MongoDB + Mongoose 8 | Database + ODM |
| JWT + bcryptjs | Authentication |
| Cloudinary | Image storage & CDN |
| Helmet | Security headers |
| Morgan | Request logging |
| express-rate-limit | Rate limiting |
| express-mongo-sanitize | NoSQL injection prevention |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
git clone https://github.com/CoderIsSleeping/school-backend.git
cd school-backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### Run Development Server

```bash
npm run dev
```

### Run Production

```bash
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | ❌ | Admin login |
| `POST` | `/api/auth/create-user` | ✅ | Create new user (admin only) |
| `POST` | `/api/auth/change-password` | ✅ | Change password |

### Images
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/images/upload` | ✅ | Upload image |
| `GET` | `/api/images/all?page=1&limit=20` | ❌ | Get paginated images |
| `DELETE` | `/api/images/:id` | ✅ | Delete image |

### Notices
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/notices/create` | ✅ | Create notice |
| `GET` | `/api/notices/all?page=1&limit=20` | ❌ | Get paginated notices |
| `GET` | `/api/notices/latest` | ❌ | Get latest notice |
| `DELETE` | `/api/notices/:id` | ✅ | Delete notice |

## Project Structure

```
school-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Login, register, change password
│   ├── imageController.js  # Upload, fetch, delete images
│   └── noticeController.js # Create, fetch, delete notices
├── middleware/
│   └── auth.js             # JWT verification middleware
├── models/
│   ├── User.js             # User schema
│   ├── Image.js            # Image schema
│   └── Notice.js           # Notice schema
├── routes/
│   ├── auth.js             # Auth routes
│   ├── images.js           # Image routes
│   └── notices.js          # Notice routes
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
├── server.js               # Entry point
└── README.md
```

## License

ISC
