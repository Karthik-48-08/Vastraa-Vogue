# Vastraa Vogue

Vastraa Vogue is a full-stack fashion e-commerce application for browsing men's and women's clothing, managing a cart, placing orders, and maintaining a user account.

## Features

- Men and women category pages
- Separate product collections for shirts, trousers, suits, kurtas, kurtis, salwar suits, and lehengas
- Product search and catalog browsing
- Shopping cart with persistent browser storage
- User signup, login, Google authentication, and password recovery
- Protected checkout and order history
- MongoDB-backed products, users, and orders
- Responsive React interface

## Technology Stack

- **Frontend:** React 19, React Router, Bootstrap, Firebase Authentication, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JSON Web Tokens and Firebase Google Authentication
- **Email:** Nodemailer

## Project Structure

```text
vastraa_vogue/
├── client/                 # React frontend
│   ├── public/             # Static public assets
│   └── src/
│       ├── assets/         # Images and visual assets
│       ├── components/     # Shared UI components
│       ├── context/        # Auth, cart, and order state
│       ├── pages/          # Route-level pages
│       └── firebase.jsx    # Firebase client configuration
└── server/                 # Express API
    ├── config/             # Firebase service configuration
    ├── controllers/        # Request handlers
    ├── middleware/         # Authentication middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── utils/              # Shared backend utilities
    ├── index.js            # API entry point
    └── seed.js             # Sample product seeder
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB, running locally or available through a MongoDB connection URI
- A Firebase project if Google authentication or Firebase client features are used

## Installation

Clone the repository and install dependencies for the frontend and backend:

```bash
git clone https://github.com/Karthik-48-08/Vastraa-Vogue.git
cd Vastraa-Vogue

cd client
npm install

cd ../server
npm install
```

## Environment Configuration

Create or update `server/.env` with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vastraavogue
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development

EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-provider-password-or-app-password
```

The backend also expects Firebase service-account configuration under `server/config/firebaseServiceAccount.json.json`.

Firebase's browser configuration is currently in `client/src/firebase.jsx`. Replace its values when using a different Firebase project. Never commit real private keys, service-account credentials, email passwords, or JWT secrets to source control.

## Running the Application

Start MongoDB, then open two terminals.

### Start the backend

```bash
cd server
npm start
```

The API runs on `http://localhost:5000` by default.

### Start the frontend

```bash
cd client
npm start
```

The development site runs at `http://localhost:3000`.

## Seed Sample Products

To populate MongoDB with the bundled sample catalog:

```bash
cd server
node seed.js
```

The seeder clears the existing products collection and inserts the sample data.

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Backend health check |
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Log in a user |
| POST | `/api/auth/google-auth` | Google authentication |
| POST | `/api/auth/forgot-password` | Start password recovery |
| POST | `/api/auth/verify-otp` | Verify a password-reset OTP |
| POST | `/api/auth/reset-password` | Reset the password |
| GET | `/api/products` | List products |
| POST | `/api/orders` | Create an order (authenticated) |
| GET | `/api/orders/myorders` | List the current user's orders |
| GET | `/api/orders/test-db` | Check database and order status |

## Available Frontend Scripts

Run these commands from the `client` directory:

- `npm start` - starts the React development server
- `npm run build` - creates a production build in `client/build`
- `npm test` - runs the React test suite

## Production Notes

- Configure CORS, frontend API URLs, Firebase domains, and MongoDB credentials for the deployment environment.
- Use environment-specific secrets and rotate any credentials that have previously been committed.
- Build the frontend with `npm run build` and serve `client/build` through a static host or configure the Express server accordingly.
