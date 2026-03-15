# DevDen Forum

DevDen Forum is a full-stack themed Q&A forum built to match the assignment brief for a 3-tier web application. Users can register, log in, browse categories, ask questions, and post answers.

## Theme
A developer learning forum with a small hierarchy of topics:
- JavaScript
- React
- Node.js
- CSS
- Career Advice

## Tech Stack
### Data layer
- MongoDB
- Mongoose ODM

### Application layer
- Node.js
- Express.js
- JSON API
- JWT authentication
- bcrypt password hashing

### Presentation layer
- React
- React Router
- Vite
- Plain CSS

## Features implemented
- User registration with validation
- Login with invalid-credentials handling
- Dashboard after successful authentication
- Left-side category menu
- Category-based question listing in chronological order
- New question page
- Question validation requiring a question mark
- Question detail page with answers
- Add-answer modal
- Client-side and server-side validation
- Seed script for example data

## Project structure
```text
devden-forum/
├── backend/
├── frontend/
└── docs/
```

## Local setup

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend
Open a second terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment variables

### backend/.env
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/devden_forum
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment guide
This repository is ready for deployment to:
- Backend: Render / Railway
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas

Detailed deployment steps are in `docs/deployment-guide.md`.

## Submission links
A ready-to-fill Word template is included in:
- `docs/submission-links-template.docx`

## Notes
I prepared the codebase, structure, seed data, and submission template. Publishing to GitHub and deploying to live hosting must be done with your own accounts.
