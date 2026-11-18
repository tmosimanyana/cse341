# CSE341 — Portfolio API and Google OAuth Coursework

A Node.js and Express coursework project containing a professional-profile endpoint, Google OAuth authentication, a protected route, Swagger UI documentation, and a MongoDB project-service module.

> **Status:** Development/coursework project. The repository has not yet been verified end-to-end with Google OAuth credentials or a running MongoDB database. Some API documentation and project-service code are present without corresponding mounted routes.

## Technology

- Node.js and Express
- Passport and passport-google-oauth20
- express-session
- MongoDB Node.js driver
- Swagger UI and OpenAPI
- dotenv and CORS

## Routes currently mounted by the server

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Serves the frontend `index.html` file |
| GET | `/health` | Basic server health response |
| GET | `/professional` | Returns the professional profile data as JSON |
| GET | `/auth/google` | Starts Google OAuth login |
| GET | `/auth/google/callback` | Handles the Google OAuth callback |
| GET | `/auth/failure` | Displays an authentication failure message |
| GET | `/auth/logout` | Logs out the Passport session |
| GET | `/protected` | Returns profile information to an authenticated user |
| GET | `/api-docs` | Serves the Swagger UI |

## Local setup

1. Install Node.js and npm.
2. Clone the repository:

   ```bash
   git clone https://github.com/tmosimanyana/cse341.git
   cd cse341
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and provide your own Google OAuth credentials and a long, random session secret.

   ```bash
   cp .env.example .env
   ```

5. In the Google Cloud OAuth client configuration, register the same callback URL used by `CALLBACK_URL` in `.env`.
6. Start the application:

   ```bash
   npm run dev
   ```

The default port is 8080. Open `/api-docs` for the Swagger UI and `/health` for the basic health response.

## Environment variables

- `CLIENT_ID`: Google OAuth client ID.
- `CLIENT_SECRET`: Google OAuth client secret.
- `SESSION_SECRET`: Long, random secret used to sign session cookies. The server now refuses to start when this value is missing.
- `CALLBACK_URL`: Full Google OAuth callback URL. The example uses `http://localhost:8080/auth/google/callback`.
- `PORT`: Optional server port; defaults to 8080.

Do not commit `.env` or publish OAuth credentials.

## Important implementation notes

- The Google OAuth strategy returns the Google profile through Passport; no persistent user-account store is configured in the inspected code.
- The protected route checks Passport authentication and returns `req.user.displayName`.
- The professional profile endpoint currently returns hard-coded profile data.
- A MongoDB project service module exists, with functions for listing, reading, creating, updating, and deleting projects. However, no MongoDB connection setup or project routes are currently mounted in `server.js`, so these functions are not an active API feature yet.
- The OpenAPI document describes project endpoints that are not currently mounted by the server. Treat those documented endpoints as planned/incomplete until implemented and tested.
- Session configuration now requires `SESSION_SECRET`, disables saving uninitialized sessions, and marks cookies secure when `NODE_ENV=production`.
- The app has not been tested end-to-end with real Google OAuth credentials or MongoDB. The `npm test` script is currently a placeholder that exits with an error; there is no automated test suite.

## Project scope

This is a learning/coursework project. Confirm functionality locally and keep profile claims aligned with demonstrated experience before using the endpoint as a public professional portfolio.

Repository: https://github.com/tmosimanyana/cse341