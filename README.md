## Node API Server

An Express.js REST API backed by MySQL that implements API key gating, device-token registration, JWT-based authentication (short-lived access tokens and long-lived refresh tokens), structured logging, validation, and basic user profile endpoints.

### Features

- **Express + MySQL2**: Simple query wrapper with promise support
- **Auth**: JWT access token (short TTL) + DB-backed refresh token rotation per device
- **API key gating**: All routes under `/api/v1` require `x-api-key`
- **Device Tokens**: Register a device before login/register
- **Validation**: `express-validator`-based request validation
- **Logging**: Winston logging to files and console (non-production)
- **CORS**: Basic CORS enabled (default: `http://localhost`)

### Project Structure

```
config/            # database and router wiring, winston config
controllers/       # route handlers (auth, user, test)
environments/      # environment files (sample.env)
middleware/        # auth, error, and token validation middleware
models/            # DB access modules (users, tokens, instance)
routes/            # express routers per feature
utils/             # helpers (mysql wrapper, token generation, logger, etc.)
server.js          # app entrypoint
db.sql             # database schema and seed
API Server.postman_collection.json  # Postman collection
```

---

## Prerequisites

- Node.js 16+ (recommended)
- MySQL 8+ or MariaDB
- npm (bundled with Node.js)

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
cp environments/sample.env environments/.env
# edit environments/.env with your DB credentials and secrets
```

3. Create database and import schema

```bash
# create database (if not exists) matching DATABASE_NAME in .env
# then import the schema and seed
mysql -u <user> -p <database_name> < db.sql
```

4. Start the server

Option A: Install a CLI for dotenv (matches current npm script)

```bash
npm i -D dotenv-cli
npm start
```

Option B: Use Node's preload for dotenv without extra dev deps

```bash
node -r dotenv/config server.js dotenv_config_path=./environments/.env
```

The server starts on `PORT` from `.env` (default `7777`). Base URL:

```
http://localhost:<PORT>/api/v1
```

> Note: CORS origin is set to `http://localhost` in `server.js`. Adjust for your client’s origin/port if needed.

---

## Configuration

All configuration is loaded from `environments/.env`. Key variables:

- `NODE_ENV` — `development` | `production`
- `PORT` — Express server port
- `JWT_SECRET` — Secret for access tokens
- `JWT_REFRESH_SECRET` — Secret for refresh tokens
- `REFRESH_TOKEN_EXPIRY` — e.g., `365d`
- `DATABASE_HOST`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- `DATABASE_TABLE_PREFIX` — optional prefix for table names
- Table names used by the app:
  - `DEVICE_TOKEN_TABLE` (default: `tokens`)
  - `REFRESH_TOKEN_TABLE` (default: `refresh_token`)
  - `AUTH_TABLE_NAME` (default: `instance`)
  - `USERS_TABLE` (default: `users`)

---

## Database

Schema and a sample seed are provided in `db.sql`. Ensure the following exist:

- `instance(auth_key)` — insert your API key here (see Usage below)
- `tokens(token, timestamp, data)` — device tokens
- `refresh_token(token, device_token, timestamp)` — refresh tokens
- `users(name, lname, email, password, phone, uniq_key, date_created, date_updated, status)`

> Important: The repository includes an insert for a sample `auth_key`. Replace it for your environment.

---

## API Usage

Base path for all routes: `/api/v1`

### Required headers

- `x-api-key`: API key present in `instance.auth_key`
- `device-token`: Required for most auth operations (see flow)
- `Authorization: Bearer <token>`: Access or refresh token depending on endpoint

### Auth Flow

1. Get a device token

```bash
curl -X GET \
  -H "x-api-key: <YOUR_API_KEY>" \
  http://localhost:7777/api/v1/auth/deviceToken
```

Response:

```json
{ "deviceToken": "<DEVICE_TOKEN>" }
```

2. Register a user

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: <YOUR_API_KEY>" \
  -H "device-token: <DEVICE_TOKEN>" \
  -d '{
    "name": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "password": "P@ssw0rd123",
    "phone": "+12025550123"
  }' \
  http://localhost:7777/api/v1/auth/register
```

Response includes `tokens.accessToken` and `tokens.refreshToken`.

3. Login (if already registered)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: <YOUR_API_KEY>" \
  -H "device-token: <DEVICE_TOKEN>" \
  -d '{
    "username": "john@example.com",
    "password": "P@ssw0rd123"
  }' \
  http://localhost:7777/api/v1/auth/login
```

4. Access a protected route (User profile)

```bash
curl -X GET \
  -H "x-api-key: <YOUR_API_KEY>" \
  -H "device-token: <DEVICE_TOKEN>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  http://localhost:7777/api/v1/user
```

5. Refresh tokens

```bash
curl -X GET \
  -H "x-api-key: <YOUR_API_KEY>" \
  -H "device-token: <DEVICE_TOKEN>" \
  -H "Authorization: Bearer <REFRESH_TOKEN>" \
  http://localhost:7777/api/v1/auth/refresh
```

> Access tokens are short-lived (default 60s). Use the refresh token endpoint to obtain a new pair.

---

## Logging

- Console logging in non-production
- Files:
  - `logs` (all levels)
  - `error` (errors only)

Consider adding rotation in production (e.g., `winston-daily-rotate-file`).

## CORS

Currently configured for `http://localhost`. Update in `server.js` for custom origins or use an env-driven approach.

## Postman

Import `API Server.postman_collection.json` and set the collection variables:

- `baseUrl` (e.g., `http://localhost:7777/api/v1`)
- `x-api-key`
- `device-token`
- `accessToken` / `refreshToken`

---

## Troubleshooting

- "dotenv: command not found" when running `npm start`:
  - `npm i -D dotenv-cli`, or start with `node -r dotenv/config server.js dotenv_config_path=./environments/.env`.
- DB errors on user registration (e.g., `date_updated` NOT NULL):
  - Ensure your schema matches `db.sql` and/or update the insert to include `date_updated` or make it nullable with a default.
- 403 "Invalid auth key":
  - Ensure `x-api-key` header matches a row in the `instance` table.
- 406 "device token is missing":
  - Call `/auth/deviceToken` first and use the returned value in `device-token` header.
- JWT expires quickly (401 after ~60s):
  - This is by design for access tokens; use `/auth/refresh` or adjust the expiry in `utils/generateToken.js`.

---

## Notes and Recommendations

- Use a MySQL connection pool (`mysql2.createPool`) for production
- Parameterize CORS and other runtime configs via env
- Add rate limiting and `helmet` for security hardening
- Extend request validation (email format, password policy)
- Add tests and CI before shipping to production

## License

ISC
