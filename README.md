# AI Startup Validator

AI-powered full-stack platform for validating startup ideas with:
- Authentication (register/login)
- Founder dashboard
- AI-based idea analysis
- SWOT analysis
- Market research insights
- Competitor analysis
- Startup scoring
- Growth recommendations

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (with in-memory fallback for local/dev without DB)
- AI: OpenAI API (with deterministic local fallback)

## Project Structure
- `/client` React app
- `/server` Express API

## Setup
1. Install dependencies:
   - `npm install`
   - `npm --prefix server install`
   - `npm --prefix client install`
2. Create environment file:
   - Copy `/server/.env.example` to `/server/.env`
3. Start backend:
   - `npm run server:start`
4. Start frontend:
   - `npm run client:dev`

## Environment Variables (`/server/.env`)
- `PORT=5000`
- `JWT_SECRET=replace-with-strong-secret`
- `MONGODB_URI=mongodb://127.0.0.1:27017/ai-startup-validator`
- `OPENAI_API_KEY=your-openai-key`
- `OPENAI_MODEL=gpt-4o-mini`

## Testing
- Backend tests: `npm run server:test`
- Frontend lint: `npm run client:lint`
- Frontend build: `npm run client:build`
