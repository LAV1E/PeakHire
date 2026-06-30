# 🚀 PeakHire

An AI-powered Recruitment Management Platform built with **Node.js**, **Express.js**, **MongoDB**, **Cloudinary**, and **Google Gemini AI**.

PeakHire is a production-style backend REST API that helps recruiters and candidates manage the complete hiring process—from authentication to job posting, applications, interviews, offer letters, notifications, and AI-powered resume analysis.

> **Status:** ✅ Backend Completed | 🚧 Frontend Coming Soon

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Email Verification (OTP)
- Login
- Login with OTP
- Forgot Password
- Reset Password
- JWT Authentication
- Refresh Token
- Session Management
- Logout
- Logout From All Devices

---

## 🏢 Company Management

- Create Company
- Update Company
- Delete Company
- Verify Company
- Pending Company Approval

---

## 💼 Job Management

- Create Job
- Update Job
- Delete Job
- Featured Jobs
- Job Details
- Pagination
- Search Jobs
- Advanced Search & Filtering

---

## 📄 Job Applications

- Apply for Jobs
- Withdraw Application
- Recruiter Application Management
- Update Application Status

---

## 📑 Resume Management

- Upload Resume
- Cloudinary Integration
- Resume Storage
- Resume Retrieval
- PDF Resume Parsing

---

## 🤖 AI Resume Analysis

Powered by **Google Gemini AI**

Features include:

- Resume Summary
- ATS Score
- Skill Extraction
- Strength Analysis
- Missing Skills
- Improvement Suggestions

---

## 📅 Interview Management

- Schedule Interviews
- Update Interviews
- Cancel Interviews
- Recruiter Interview Dashboard
- Candidate Interview Dashboard

---

## 📨 Offer Letter Management

- Create Offer Letter
- Accept Offer
- Reject Offer
- Recruiter Offers
- Candidate Offers

---

## 🔔 Notification System

- Get Notifications
- Mark as Read
- Mark All as Read
- Delete Notification
- Delete All Notifications
- Unread Count

---

## 📊 Dashboard

- Recruiter Dashboard
- Candidate Dashboard
- Statistics

---

## 🔍 Advanced Search

- Keyword Search
- Location Filter
- Company Filter
- Experience Filter
- Employment Type Filter
- Salary Filter
- Sorting
- Pagination

---

## 🛡 Security

- JWT Authentication
- Role-Based Authorization
- Helmet
- CORS
- Rate Limiting
- Password Hashing (bcrypt)
- Cookie Parser

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

### AI

- Google Gemini AI

### File Upload

- Cloudinary

### Documentation

- Swagger UI

---

# 📂 Project Structure

```text
PeakHire
│
├── Backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/LAV1E/PeakHire.git
```

Move into the project

```bash
cd PeakHire
```

Move into Backend

```bash
cd Backend
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
PORT=

MONGO_URI=

JWT_SECRET=
JWT_REFRESH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_USER=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=
```

---

# 📚 API Documentation

Swagger documentation is available at:  https://peakhire.onrender.com/api-docs/

```
/api-docs
```

Example after deployment:

```
http://localhost:3000/api-docs/
```

---

# 🚀 Deployment

Backend deployment link will be added after deployment.

---

# 🚧 Future Improvements

- Frontend (React.js / Next.js)
- Admin Dashboard
- Email Templates
- Analytics Dashboard
- Docker Support
- CI/CD Pipeline

---


---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.