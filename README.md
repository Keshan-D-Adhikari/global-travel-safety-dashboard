# Global Travel & Safety Dashboard — Quick Start


## Prerequisites
- Node.js (16+ recommended)
- MongoDB running (local or Atlas)


## Backend
1. cd backend
2. copy .env.example to .env and fill values
3. npm install
4. npm run dev (or npm start)


## Frontend
1. Serve the frontend folder (e.g., open frontend/index.html in browser or use a static server)
2. Edit frontend/script.js configuration: BACKEND_URL, API_KEY, OAUTH_BEARER, OPENWEATHER_KEY


## Notes on OAuth 2.0
- This starter contains a placeholder token verification middleware. Replace `verifyOAuthToken` in `server.js` with an actual token introspection or JWT validation implementation from your chosen OAuth provider.
- Example providers: Google Identity Platform, Auth0, Keycloak.


## Submission contents
- frontend/ (index.html, styles.css, script.js)
- backend/ (server.js, package.json, .env.example)
- README.md (this file)
- Screenshots: take dashboard screenshots after running and add them to submission zip


Good luck! If you want, I can:
- Convert the frontend to React, or
- Implement real OAuth 2.0 verification using a provider you choose, or
- Help deploy the app to Heroku / Render / Railway / Vercel