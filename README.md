# Clipboard - Secure File Sharing Application

A secure, JWT-authenticated file sharing application built with [Next.js](https://nextjs.org) and [Vercel Blob](https://vercel.com/storage/blob) for cloud storage.

## 🎯 Project Overview

Clipboard is a modern web application that allows authenticated users to upload, manage, and share files securely. Files are stored in Vercel Blob storage with automatic expiration management, and access is protected by JWT authentication.

### Key Features

- 🔐 **JWT Authentication** - Secure login system with HTTP-only cookies
- 📤 **File Upload** - Drag-and-drop interface with progress tracking
- 📋 **File Management** - List, view, and delete uploaded files
- 💾 **Cloud Storage** - Integration with Vercel Blob for scalable file storage
- ⏱️ **Auto Expiration** - Files can be configured to expire after a set time
- 🔄 **Scheduled Cleanup** - Cron job for removing expired files

## 🛠️ Tech Stack

- **Frontend**: React 19, Next.js 16 with App Router
- **Styling**: Tailwind CSS 4, PostCSS 4
- **File Upload**: react-dropzone, Vercel Blob client
- **Authentication**: JWT (jsonwebtoken), jose for verification
- **Backend**: Next.js API routes
- **Utilities**: formidable for file parsing, cookie for HTTP cookie handling

## 📁 Project Structure

```
clipboard/
├── app/                          # Next.js App Router
│   ├── page.js                   # Main dashboard page
│   ├── login/
│   │   └── page.js              # Login page
│   ├── layout.js                # Root layout
│   ├── globals.css              # Global styles
│   ├── components/
│   │   └── CircularProgress.jsx # Upload progress component
│   └── api/
│       └── cron/
│           └── route.js         # Scheduled cleanup job
├── pages/api/                    # Legacy API routes
│   ├── login.js                 # Authentication endpoint
│   ├── upload.js                # Get upload token
│   ├── list.js                  # List files
│   ├── delete.js                # Delete files
│   └── add.js                   # Add file to queue
├── middleware.js                # JWT verification middleware
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Vercel account with Blob storage access
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clipboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Login Credentials
   USERNAME=admin
   PASSWORD=your-secure-password

   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

   # Environment
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

### Build & Deployment

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Lint code:**
```bash
npm run lint
```

## 🔐 Authentication

### Login Flow

1. User navigates to `/login`
2. Enters username and password
3. Server validates credentials against `USERNAME` and `PASSWORD` environment variables
4. On success, a JWT token is issued and stored in an HTTP-only cookie
5. Middleware verifies the token on all protected routes

### Middleware Protection

The `middleware.js` file protects all routes except:
- `/login` - Login page (public)
- `/_next/*` - Next.js internal files
- `/favicon.ico` - Favicon
- `/api/*` - API routes (protected via other means)

Invalid or missing tokens redirect users to the login page.

## 📤 File Upload

### Upload Process

1. User selects file via drag-and-drop or file input
2. Frontend requests upload token from `/api/upload`
3. Token is used to upload file directly to Vercel Blob
4. File URL is displayed in the dashboard
5. File metadata is stored for listing and deletion

### Upload Progress

The `CircularProgress` component displays real-time upload progress during file transfers.

## 📋 API Endpoints

### POST `/api/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response (Success):**
```json
{
  "success": true
}
```
Sets `auth_token` cookie (HTTP-only, secure, 1-day expiration)

**Response (Failure):**
```json
{
  "error": "Invalid credentials"
}
```

---

### POST `/api/upload`
Generate a client token for direct file upload to Vercel Blob.

**Request:**
```json
{
  "filename": "document.pdf"
}
```

**Response:**
```json
{
  "token": "vercel_blob_client_token..."
}
```

---

### GET `/api/list`
Retrieve all files from Vercel Blob storage.

**Response:**
```json
[
  {
    "pathname": "document.pdf",
    "contentType": "application/pdf",
    "contentLength": 1024,
    "uploadedAt": "2025-04-28T10:00:00Z"
  }
]
```

---

### POST `/api/delete`
Delete a file from Vercel Blob storage.

**Request:**
```json
{
  "pathname": "document.pdf"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### POST `/api/add`
Add a file to the deletion queue with automatic expiration.

**Request:**
```json
{
  "pathname": "document.pdf"
}
```

**Response:**
```json
{
  "success": true
}
```

Queues file for deletion after 30 minutes.

---

### GET `/api/cron`
Scheduled endpoint for cleaning up expired files. Should be triggered by a cron service.

**Response:**
```json
{
  "deletedCount": 3
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-super-secret-key` |
| `USERNAME` | Admin username for login | `admin` |
| `PASSWORD` | Admin password for login | `secure-password` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob API token | `vercel_blob_...` |
| `NODE_ENV` | Environment (development/production) | `development` |

### Tailwind CSS Configuration

Tailwind CSS 4 with PostCSS is pre-configured. Customize via `postcss.config.mjs` and CSS files.

### ESLint Configuration

ESLint 9 with Next.js preset is configured in `eslint.config.mjs`.

## 🔧 Development Guidelines

### Adding New Features

1. **API Routes**: Add new endpoints to `pages/api/`
2. **Components**: Create reusable React components in `app/components/`
3. **Pages**: Add new pages in `app/` directory (App Router)
4. **Middleware**: Modify `middleware.js` for route protection

### Code Style

- Use ES modules (`.mjs`, `.js` with `"type": "module"`)
- Format with ESLint
- Follow Next.js best practices
- Use functional components with React hooks

### Testing

Currently no testing framework configured. Consider adding:
- Jest for unit testing
- React Testing Library for component testing
- Supertest for API testing

## 📦 Dependencies

### Core
- `next@16.2.4` - React framework
- `react@19.2.5` - UI library
- `react-dom@19.2.5` - React DOM

### Authentication & Security
- `jsonwebtoken@9.0.2` - JWT token signing
- `jose@6.0.11` - JWT verification
- `cookie@1.0.2` - Cookie parsing/serialization

### File Handling
- `@vercel/blob@2.3.0` - Cloud storage integration
- `formidable@3.5.4` - Multipart form parsing
- `react-dropzone@14.3.8` - Drag-and-drop component

### Styling
- `@tailwindcss/postcss@4` - Tailwind PostCSS plugin
- `tailwindcss@4` - Utility-first CSS framework

### Development
- `eslint@9` - Code linting
- `eslint-config-next@15.3.5` - Next.js ESLint config

## 🐛 Troubleshooting

### Login Not Working
- Verify `JWT_SECRET`, `USERNAME`, and `PASSWORD` are set in `.env.local`
- Check that credentials in the environment variables match your input

### Files Not Uploading
- Verify `BLOB_READ_WRITE_TOKEN` is valid and has write permissions
- Check browser console for error messages
- Ensure file size is within Vercel Blob limits

### Protected Routes Redirecting to Login
- Check that the JWT token is properly set in cookies
- Verify `middleware.js` matcher configuration
- Ensure `JWT_SECRET` matches between token signing and verification

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with automatic builds on push

**Recommended Vercel Settings:**
- Node.js version: 18 or higher
- Build command: `npm run build`
- Start command: `npm start`

### Scheduled Cron Jobs

Configure cron jobs to call `/api/cron` periodically (every hour recommended):
- **Vercel Cron**: Use Vercel's native cron functionality
- **Third-party services**: EasyCron, IFTTT, or similar services

## 📝 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For issues or questions, refer to the [Next.js Documentation](https://nextjs.org/docs) and [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob).
