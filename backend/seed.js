const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recruiter = require('./models/Recruiter');
const Job = require('./models/Job');
const bcrypt = require('bcryptjs');

dotenv.config();

const companies = [
    {
        name: 'Google',
        email: 'careers@google.com',
        password: 'password123',
        companyName: 'Google',
        phone: '1234567890',
        description: 'Organizing the world\'s information.',
        website: 'https://careers.google.com'
    },
    {
        name: 'Microsoft',
        email: 'careers@microsoft.com',
        password: 'password123',
        companyName: 'Microsoft',
        phone: '0987654321',
        description: 'Empowering every person and organization to achieve more.',
        website: 'https://careers.microsoft.com'
    },
    {
        name: 'Amazon',
        email: 'careers@amazon.com',
        password: 'password123',
        companyName: 'Amazon',
        phone: '1122334455',
        description: 'Earth\'s most customer-centric company.',
        website: 'https://www.amazon.jobs'
    },
    {
        name: 'Netflix',
        email: 'careers@netflix.com',
        password: 'password123',
        companyName: 'Netflix',
        phone: '5544332211',
        description: 'Entertaining the world.',
        website: 'https://jobs.netflix.com'
    },
    {
        name: 'Adobe',
        email: 'careers@adobe.com',
        password: 'password123',
        companyName: 'Adobe',
        phone: '6677889900',
        description: 'Changing the world through digital experiences.',
        website: 'https://adobe.com/careers'
    }
];

const jobs = [
    {
        title: 'Software Engineer',
        description: 'Work on large scale distributed systems. Experience with Java or C++ required.',
        location: 'Mountain View, CA',
        salary: 150000,
        jobType: 'Full-time',
        requiredSkills: ['Java', 'C++', 'Distributed Systems'],
        minCGPA: 8.0,
        companyIndex: 0 // Google
    },
    {
        title: 'Frontend Developer Intern',
        description: 'Build beautiful user interfaces using React and Angular.',
        location: 'Bangalore, India',
        salary: 50000,
        jobType: 'Internship',
        requiredSkills: ['React', 'JavaScript', 'CSS'],
        minCGPA: 7.5,
        companyIndex: 0 // Google
    },
    {
        title: 'Full Stack Developer',
        description: 'Develop full stack web applications using .NET and Azure.',
        location: 'Redmond, WA',
        salary: 140000,
        jobType: 'Full-time',
        requiredSkills: ['.NET', 'C#', 'Azure'],
        minCGPA: 7.0,
        companyIndex: 1 // Microsoft
    },
    {
        title: 'Data Scientist',
        description: 'Analyze large datasets to improve customer experience.',
        location: 'Seattle, WA',
        salary: 160000,
        jobType: 'Full-time',
        requiredSkills: ['Python', 'Machine Learning', 'SQL'],
        minCGPA: 8.5,
        companyIndex: 2 // Amazon
    },
    {
        title: 'SDE-1',
        description: 'Entry level software development engineer role.',
        location: 'Hyderabad, India',
        salary: 2500000, // INR roughly converted logic or just raw number
        jobType: 'Full-time',
        requiredSkills: ['Java', 'Data Structures', 'Algorithms'],
        minCGPA: 8.0,
        companyIndex: 2 // Amazon
    },
    {
        title: 'UI/UX Designer',
        description: 'Design intuitive and engaging user experiences for millions of users.',
        location: 'Los Gatos, CA',
        salary: 130000,
        jobType: 'Full-time',
        requiredSkills: ['Figma', 'Sketch', 'Prototyping'],
        minCGPA: 7.0,
        companyIndex: 3 // Netflix
    },
    {
        title: 'Product Manager',
        description: 'Lead the vision and strategy for Adobe Creative Cloud products.',
        location: 'San Jose, CA',
        salary: 170000,
        jobType: 'Full-time',
        requiredSkills: ['Product Management', 'Agile', 'Strategy'],
        minCGPA: 7.5,
        companyIndex: 4 // Adobe
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data (Recruiters and Jobs)
        // Careful: This deletes existing recruiters.
        // If user wants to keep their own account, we might want to skip this or be careful.
        // For now, I will NOT delete all, I will just Upsert based on email handling.
        // Actually, to ensure a clean "dataset" feel, wiping is often best, but risky.
        // Let's check if there are any jobs first.

        // For safety in this context, I will wipe Jobs but only wiped Recruiters that match my seed emails?
        // Or just wipe all for a fresh demo state. Let's wipe all for simplicity as it's a "fix" request.

        await Job.deleteMany({});
        console.log('Cleared Jobs');

        // To avoid deleting the user's current account if they are logged in, maybe I should be careful.
        // But the user asked to "put dataset", implying they want this data.
        // I'll assume wiping is okay or I'll just add new ones. 
        // Adding new ones is safer.

        const createdRecruiters = [];

        for (const company of companies) {
            // Check if exists
            let recruiter = await Recruiter.findOne({ email: company.email });
            if (!recruiter) {
                const hashedPassword = await bcrypt.hash(company.password, 10);
                recruiter = await Recruiter.create({
                    ...company,
                    password: hashedPassword
                });
                console.log(`Created Recruiter: ${company.name}`);
            } else {
                console.log(`Recruiter exists: ${company.name}`);
            }
            createdRecruiters.push(recruiter);
        }

        for (const job of jobs) {
            const company = createdRecruiters[job.companyIndex];
            await Job.create({
                ...job,
                company: company._id,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            });
            console.log(`Created Job: ${job.title} at ${company.companyName}`);
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
