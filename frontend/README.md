# Campus Placement System - Frontend

A React-based frontend for the Campus Placement System application.

## Features

- User authentication (Login/Register)
- Student dashboard for job applications
- Recruiter dashboard for job postings
- Admin dashboard for system management
- Protected routes for authenticated users

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── assets/         # Images, icons, logos
│   ├── components/     # Reusable components
│   ├── pages/          # Application pages
│   ├── services/       # API calls using Axios
│   ├── context/        # Auth and global state
│   ├── utils/          # Helper functions
│   ├── App.js          # Main App component
│   └── index.js        # Entry point
└── package.json
```

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will run on http://localhost:3000

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite

## Technologies Used

- React 18
- React Router v6
- Axios for API calls
- CSS for styling

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## License

This project is licensed under the MIT License.
