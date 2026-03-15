# Deployment Guide for DevDen Forum

## 1. Create the GitHub repository
1. Create a new GitHub repository.
2. Upload all files from this project.
3. Push the code to the `main` branch.

## 2. Create the MongoDB Atlas database
1. Open MongoDB Atlas.
2. Create a free cluster.
3. Create a database user and allow network access.
4. Copy the MongoDB connection string.
5. Replace the password placeholder in the URI.

## 3. Deploy the backend to Render
1. Create a new Web Service in Render.
2. Connect your GitHub repository.
3. Set the root directory to `backend`.
4. Build command:
   ```bash
   npm install
   ```
5. Start command:
   ```bash
   npm start
   ```
6. Add environment variables:
   - `PORT=5000`
   - `MONGODB_URI=<your atlas connection string>`
   - `JWT_SECRET=<your secure random secret>`
   - `FRONTEND_URL=<your frontend hosted URL>`

## 4. Seed the database
After the backend is live, run the seed script locally with the same Atlas URI:
```bash
cd backend
npm install
npm run seed
```

## 5. Deploy the frontend to Vercel
1. Create a new Vercel project.
2. Import the same repository.
3. Set the root directory to `frontend`.
4. Add this environment variable:
   - `VITE_API_URL=<your backend public URL>/api`
5. Deploy the project.

## 6. Update CORS
Make sure `FRONTEND_URL` in the backend matches your real Vercel or Netlify URL.

## 7. Submission
Use the provided Word template and fill in:
- GitHub repository link
- Live hosted application link
- Theme used for the forum
