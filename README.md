# Campus Placement System

A full-stack web application for managing campus placements, connecting students with recruiters and streamlining the recruitment process.

## Project Overview

The Campus Placement System is built with:
- **Frontend**: React with React Router for navigation and Axios for API calls
- **Backend**: Node.js with Express for REST API and MongoDB for data persistence

## Project Structure

```
campus-placement-system/
├── frontend/                       # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/                # Images, icons, logos
│   │   ├── components/            # Reusable components
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   └── ProtectedRoute/
│   │   ├── pages/                 # Application pages
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── StudentDashboard/
│   │   │   ├── RecruiterDashboard/
│   │   │   └── AdminDashboard/
│   │   ├── services/              # API calls (Axios)
│   │   ├── context/               # Auth and global state
│   │   ├── utils/                 # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── backend/                        # Node.js/Express backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/                    # MongoDB schemas
│   │   ├── Student.js
│   │   ├── Recruiter.js
│   │   ├── Job.js
│   │   └── Admin.js
│   ├── controllers/               # Business logic
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── recruiterController.js
│   │   └── adminController.js
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── recruiterRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/                # Middleware functions
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── uploads/                   # Resume uploads
│   ├── server.js                  # Entry point
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── README.md
│
└── README.md                       # This file
```

## Features

### For Students
- User registration and login
- Browse available job postings
- Apply for jobs
- Track application status
- Update profile and resume

### For Recruiters
- Company registration
- Post new job openings
- Manage applications
- Update applicant status (Shortlist, Reject, Select)
- View applicant profiles

### For Administrators
- Manage all users (Students and Recruiters)
- View system statistics
- Delete user accounts
- Monitor job postings

## Technologies Used

### Frontend
- React 18
- React Router v6
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcryptjs

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/campus-placement
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/applications` - Get applications
- `POST /api/student/apply` - Apply for job

### Recruiter Endpoints
- `POST /api/recruiter/create-job` - Create job posting
- `GET /api/recruiter/job-postings` - View job postings
- `PUT /api/recruiter/update-status` - Update applicant status
- `GET /api/recruiter/profile` - Get recruiter profile

### Admin Endpoints
- `GET /api/admin/students` - Get all students
- `GET /api/admin/recruiters` - Get all recruiters
- `DELETE /api/admin/delete-user` - Delete user
- `GET /api/admin/stats` - Get system statistics

## Database Schema

### Student
- name (String)
- email (String, unique)
- password (String, hashed)
- rollNumber (String)
- phone (String)
- resume (String - file path)
- skills (Array)
- cgpa (Number)
- applications (Array of Job references)

### Recruiter
- name (String)
- email (String, unique)
- password (String, hashed)
- companyName (String)
- companyWebsite (String)
- phone (String)
- logo (String)
- jobPostings (Array of Job references)

### Job
- title (String)
- description (String)
- company (Recruiter reference)
- location (String)
- salary (Number)
- jobType (Enum: Full-time, Part-time, Internship)
- requiredSkills (Array)
- minCGPA (Number)
- applicants (Array with student reference and status)
- deadline (Date)

### Admin
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String - default: 'admin')

## Running Both Frontend and Backend

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Future Enhancements

- Email notifications for applications
- Resume parsing and skill extraction
- Advanced job search and filtering
- Interview scheduling system
- Performance analytics and reports
- Mobile app version
- Real-time notifications using WebSocket

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For any issues or questions, please open an issue on the repository.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
