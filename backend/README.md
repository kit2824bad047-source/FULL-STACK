# Campus Placement System - Backend

A Node.js and Express-based backend API for the Campus Placement System application.

## Features

- User authentication and authorization (Students, Recruiters, Admin)
- Job postings and applications management
- User profile management
- Admin dashboard functionality
- Resume uploads and management

## Project Structure

```
backend/
├── config/              # Database configuration
├── models/              # MongoDB schemas
├── controllers/         # Business logic
├── routes/              # API routes
├── middleware/          # Custom middleware
├── uploads/             # Resume storage
├── server.js            # Entry point
├── .env                 # Environment variables
└── package.json
```

## Installation

```bash
npm install
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Student Routes
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/applications` - Get student applications
- `POST /api/student/apply` - Apply for a job

### Recruiter Routes
- `POST /api/recruiter/create-job` - Create a job posting
- `GET /api/recruiter/job-postings` - Get recruiter's job postings
- `PUT /api/recruiter/update-status` - Update applicant status
- `GET /api/recruiter/profile` - Get recruiter profile

### Admin Routes
- `GET /api/admin/students` - Get all students
- `GET /api/admin/recruiters` - Get all recruiters
- `DELETE /api/admin/delete-user` - Delete a user
- `GET /api/admin/stats` - Get system statistics

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/campus-placement
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcryptjs for password hashing
- Multer for file uploads
- Cors for cross-origin requests

## Database Models

- **Student**: Student user accounts with profile information
- **Recruiter**: Recruiter/Company accounts
- **Job**: Job postings with applicant tracking
- **Admin**: Administrative user accounts

## License

This project is licensed under the MIT License.
