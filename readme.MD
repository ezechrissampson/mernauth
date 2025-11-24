# MERNAUTH – Full-Stack MERN Authentication

MERNAUTH is a **MERN authentication base** you can reuse for your projects.  
It includes:

- ✅ **User app** (React)  
- ✅ **Admin app** (React)  
- ✅ **Backend API** (Node + Express + MongoDB)  
- ✅ **JWT + sessions + cookies**  
- ✅ **Email verification & password reset**  
- ✅ **Google OAuth**  
- ✅ **Secure auth patterns** (rate limiting, single active session, etc.)

The repo is structured with three main folders:

- `/` – user-facing frontend
- `/admin` – admin dashboard frontend
- `/backend` – Node/Express API
- Root – shared scripts & dev tools (`concurrently` to run all at once)


## Project Structure

```bash
MERNAUTH/
├── admin/          # Admin React app
├── user/           # User React app
├── backend/        # Node + Express + MongoDB API
├── package.json    # Root config (concurrently, shared scripts)
└── README.md


- Getting Started

- git clone https://github.com/ezechrissampson/mernauth.git
cd mernauth

- Install dependencies (root + all apps)

At the root of the project:

npm install


If your setup doesn’t auto-install inside subfolders, also run:

cd backend && npm install
cd ../user && npm install
cd ../admin && npm install
cd ..

MongoDB Setup
You can use MongoDB Atlas (online) or local MongoDB (offline).
Option A: MongoDB Atlas (Recommended)


Create a free cluster on MongoDB Atlas.

Get your connection string, e.g.:
mongodb+srv://<username>:<password>@cluster0.mongodb.net/mernauth

Put it in your backend .env (see below) as MONGO_URI.

Option B: Local MongoDB (Mongo Shell / Compass)

Install MongoDB locally.

Start MongoDB service.

Use a URI like:
mongodb://127.0.0.1:27017/mernauth


- Environment Variables
Create a .env file inside the backend folder:
cd backend

Example .env:
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/mernauth
# or your Atlas URI

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Client URLs (React apps)
CLIENT_URL=http://localhost:5173   
ADMIN_CLIENT_URL=http://localhost:5174  

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Gmail + App Password)
GMAIL_USER=yourgmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here

# User URI
CLIENT_URL=http://localhost:5173


Notes

GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET come from Google Cloud Console → OAuth 2.0.
GMAIL_APP_PASSWORD is a Google App Password, not your normal account password.


- Email Sending
The backend uses Nodemailer + Gmail.
Example config:
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (toEmail, subject, text, html) => {
  const mailOptions = {
    from: `"Mernauth" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

Emails are sent in HTML format, e.g.:

Verification email (with code-only flow)
Password reset email (button + raw link fallback)



- Authentication Overview
MERNAUTH implements a layered, secure auth system:

JWT for access tokens
Session collection in MongoDB to track valid tokens
Cookies (optional) for storing JWT (httpOnly, secure, sameSite)
Single active session per user (optional logic)
Email verification (via OTP code)
Password reset (secure token + hashed in DB)
Google OAuth login/signup
Protected routes via protect middleware


Key Backend Auth/User Flows

POST /api/auth/signup
Creates a user and sends verification code via email.

POST /api/auth/verify-email
Verifies email using a code only (no URL needed by the user).

POST /api/auth/login
Login with email/username + password → returns JWT, creates session, optionally sets cookie.

POST /api/auth/google
Google OAuth accessToken → find/create user → JWT + session.

POST /api/auth/logout
Destroys session linked to the token. Can also clear auth cookie.

GET /api/auth/profile
Protected – uses protect middleware (JWT + session validation).

PUT /api/auth/profile
Update user info (name, email, etc.).

PUT /api/auth/profile/password
Change password (requires old + new).

POST /api/auth/forgot-password
Sends password reset email with secure link.

POST /api/auth/reset-password/:token
Validates hashed reset token and sets a new password.



- JWT, Sessions & Cookies
JWT
Generated on login / Google auth:
export const generateToken = (userId, sessionId) => {
  return jwt.sign(
    { id: userId, sessionId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

Sessions
Each login creates a Session document with:


user (ObjectId)
token (JWT string)
userAgent
createdAt, etc.
Session validation is done in something like validateSessionToken(token).
The protect middleware:
Reads token (from Authorization: Bearer <token> and/or cookie).
Verifies JWT.
Checks session in DB to ensure the token is still valid.
Loads req.user from MongoDB.


- Cookies
You can optionally store the token in an HTTP-only cookie:
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

On the frontend, include credentials when needed:
axios.get("/api/auth/profile", { withCredentials: true });


- Running the Apps
From the root of the project:
1. Run everything with one command
npm start

The root package.json should have something like:
{
  "scripts": {
    "start": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix user\" \"npm run dev --prefix admin\""
  }
}

This will start:

Backend server – e.g. http://localhost:5000
User app – e.g. http://localhost:5173
Admin app – e.g. http://localhost:5174


(Adjust ports depending on your actual configuration.)
2. Run each app individually
Backend:
cd backend
npm run dev

User:
cd user
npm run dev

Admin:
cd admin
npm run dev


- User App (/)
The user-facing frontend.
Typical stack:

React
React Router
Axios
Bootstrap
@react-oauth/google (for Google login)


Main Features

Signup Page
Fields: name, username, email, password, confirm password
Sends verification code to email
Redirects to /verify-email

Login Page
Login with email or username + password
Handles needsVerification response → redirects to verify screen
Stores token (e.g. in localStorage) and can rely on cookies if configured
Email Verification Page (/verify-email)
Accepts OTP code and verifies email
Uses localStorage to know which email is being verified
Forgot / Reset Password
/forgot-password: request reset email
/reset-password/:token: set new password after clicking email link

Profile Page (/profile)
Protected route
View/update name, email
Change password
Upload profile picture (preview + backend upload)

Dashboard Page (/dashboard)
Example protected area for logged-in users


Customize the User App
Update React components & styling in user/src.
Change API base URL in your Axios config if needed:
axios.defaults.baseURL = "http://localhost:5000";
Apply your branding:
Colors
Typography
Logos
Additional fields and profile data


- Admin App (/admin)
The admin panel frontend.
Use it for:


Managing users
Admin profile & settings
Accsesing the Admin Panel
Start the admin dev server (or run everything from root).
Go to e.g. http://localhost:5174
Login using the default admin credentials created by the seeder (see next section).


Customizing the Admin App
Edit React components in admin/src.
Add pages for:
User list & search
Ban/disable users
View sessions / login history
System settings
The admin app consumes the same backend, but with admin-protected routes.

- Seed Admin / Default Admin
The project includes (or expects) a seedAdmin utility to create a default admin user if no admin exists.

Typical example (adjust to your actual code):
// backend/utils/seedAdmin.js


Important: Change these credentials and/or remove the seeder before going to production.

- Security Highlights
MERNAUTH includes several important security features:
Password hashing with bcrypt
JWT with expiration & strong secret
Session-based validation (DB-backed token tracking)
Logout invalidates sessions
Email verification (prevents unverified email abuse)
Secure password reset:
Random reset token with crypto.randomBytes(32).toString("hex")
Hashed using SHA-256 before storing
Expires after a fixed time (e.g. 1 hour)


Rate limiting on login (and optionally signup):
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Try again later." },
});

router.post("/login", loginLimiter, login);



- Manual Testing Checklist

Signup
Sign up, receive verification email, verify with code, then login.

Login
Login with email and with username.

Attempt wrong password → see error / rate limit behavior.

Email Verification
Try logging in before verifying; make sure backend responds accordingly.

Forgot Password
Request reset → receive email → follow link → reset → login with new password.

Google OAuth
Login/signup via Google; confirm user is created and can access app.

Protected Routes
Access /profile and admin pages only when logged in.
Logout → ensure protected endpoints return 401/redirect.


- Summary
MERNAUTH provides:

A complete MERN authentication boilerplate

Three-layer architecture:

/user – user-facing app

/admin – admin panel

/backend – Node/Express/Mongo API

JWT, sessions, cookies

Email verification (code-based)

Password reset

Google OAuth

Secure patterns (rate limiting, hashed tokens, session validation)

Clone it, configure .env, connect MongoDB, add your branding & features, and you have a solid, secure auth foundation for any MERN project.