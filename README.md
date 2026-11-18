# CSE341 — Portfolio API and Google OAuth Coursework

A Node.js and Express coursework project with a professional-profile endpoint, Google OAuth authentication, a protected route, Swagger UI documentation, and a MongoDB-backed projects API.

> **Status:** Development/coursework project. Code has been connected, but the application has not yet been verified end-to-end with the user's Google OAuth credentials and MongoDB instance.

## Technology

- Node.js and Express
- Passport and passport-google-oauth20
- express-session
- MongoDB Node.js driver
- Swagger UI and OpenAPI
- dotenv and CORS

## Routes

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/` | Public | Serves the frontend |
| GET | `/health` | Public | Basic server health response |
| GET | `/professional` | Public | Returns professional profile data as JSON |
| GET | `/auth/google` | Public | Starts Google OAuth login |
| GET | `/auth/google/callback` | OAuth callback | Completes Google sign-in |
| GET | `/auth/failure` | Public | Displays authentication failure |
| GET | `/auth/logout` | Signed-in session | Logs out the Passport session |
| GET | `/protected` | Signed-in session | Returns authenticated profile information |
| GET | `/api/projects` | Public | Lists portfolio projects |
| GET | `/api/projects/:id` | Public | Retrieves one project |
| POST | `/api/projects` | Google-authenticated | Creates a project |
| PUT | `/api/projects/:id` | Google-authenticated | Updates a project |
| DELETE | `/api/projects/:id` | Google-authenticated | Deletes a project |
| GET | `/api-docs` | Public | Serves Swagger UI |

## Project data

Project records follow the existing OpenAPI schema: `title`, `description`, `technologies`, `status`, and optional `url`, `startDate`, and `endDate`. Allowed status values are `Planning`, `In Progress`, `Completed`, and `On Hold`. Creation and update requests validate the required fields, status, URL protocol, and date format.

## Local setup

1. Install Node.js and npm, and install or run MongoDB locally.
2. Clone the repository:

   ```bash
   git clone https://github.com/tmosimanyana/cse341.git
   cd cse341
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and fill in your own values:

   ```bash
   cp .env.example .env
   ```

5. Configure a Google OAuth client in Google Cloud. Register the exact callback URL from `CALLBACK_URL` as an authorized redirect URI.
6. Ensure MongoDB is running and that `MONGODB_URI` and `DB_NAME` point to the intended database.
7. Start the server:

   ```bash
   npm run dev
   ```

The default port is 8080. Visit `/health`, `/professional`, `/api/projects`, and `/api-docs` on the local server to inspect the public endpoints and API documentation.

## Environment variables

- `CLIENT_ID`: Google OAuth client ID.
- `CLIENT_SECRET`: Google OAuth client secret.
- `SESSION_SECRET`: Long, random secret used to sign session cookies; required at startup.
- `CALLBACK_URL`: Full Google OAuth callback URL. Local example: `http://localhost:8080/auth/google/callback`.
- `MONGODB_URI`: MongoDB connection string.
- `DB_NAME`: MongoDB database name; defaults to `portfolio` if omitted.
- `PORT`: Optional server port; defaults to `8080`.
- `NODE_ENV`: Set to `production` when deployed over HTTPS.

Never commit `.env` or publish OAuth or database credentials.

## Security and implementation notes

- Project reads are public. Project creation, updates, and deletion require a Google-authenticated Passport session.
- The API documents the session cookie authentication requirement for write operations.
- MongoDB connection is established before the HTTP server starts. The application exits with an error if `MONGODB_URI` is missing or the connection fails.
- The Google OAuth strategy currently returns the Google profile through Passport; no persistent user-account store is configured.
- The professional profile endpoint returns hard-coded profile data.
- The session uses a required secret, does not save uninitialized sessions, and marks cookies secure when `NODE_ENV=production`.
- The default Express session store is still in use; configure a persistent session store before production deployment.
- No automated test suite is configured yet. The `npm test` script remains a placeholder. Test with a development database before using the write endpoints.

## Project scope

This is a learning/coursework project. Verify functionality locally and keep public profile claims aligned with demonstrated experience.

Repository: https://github.com/tmosimanyana/cse341