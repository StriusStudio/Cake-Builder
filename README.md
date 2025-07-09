# Yenom Backend

This is the backend server for the Yenom application, built with Node.js, Express, and MongoDB. It features a robust authentication system with role-based access control.

## Features

- **User Authentication**
  - Registration with email verification
  - Login with JWT
  - Password reset functionality
  - Role-based access control (RBAC)
  - Account lockout after multiple failed attempts

- **Security**
  - Helmet for secure HTTP headers
  - Rate limiting
  - Data sanitization
  - XSS protection
  - Parameter pollution protection
  - Secure HTTP headers
  - CORS protection

- **Development**
  - Request logging
  - Error handling
  - Environment configuration
  - Scripts for common tasks

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher) or yarn

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd yenom/backend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env`

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/yenom

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email (for password reset and verification)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=no-reply@yenom.com

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100

# Client URL for CORS
CLIENT_URL=http://localhost:3000
```

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Creating the First Admin User

To create the first admin user, run:

```bash
npm run create-admin
# or
yarn create-admin
```

This will create an admin user with the following credentials:
- Email: admin@yenom.com
- Password: admin123

**Important**: Change the password after first login.

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run create-admin` - Create the first admin user
- `npm test` - Run tests (coming soon)

## Project Structure

```
src/
  config/           # Configuration files
  controllers/       # Route controllers
  middleware/        # Custom middleware
  models/            # Mongoose models
  routes/            # Route definitions
  utils/             # Utility functions and helpers
  index.js           # Application entry point
```

## Security Best Practices

1. Always use HTTPS in production
2. Keep your dependencies up to date
3. Use strong, unique passwords
4. Regularly back up your database
5. Monitor your application logs
6. Implement proper error handling
7. Use environment variables for sensitive data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
