# API Portfolio

REST API backing the [sebas-portfolio](../sebas-portfolio) frontend — serves
Projects and Guide ("vlog") content, handles admin auth, and proxies image
uploads to Cloudinary. Built with Express 5 and MongoDB (Mongoose).

Deployed at: `https://personal-zebbian-portfolio-api.onrender.com`

## Tech stack

- **Express 5**
- **MongoDB** via **Mongoose**
- **JWT** (`jsonwebtoken`) auth + **bcryptjs** password hashing
- **Zod** for request validation
- **Cloudinary** (`cloudinary` + `multer`) for image uploads
- **Helmet**, **cors**, **express-rate-limit** for baseline hardening

## API endpoints

All routes are prefixed with `/api/v1`.

| Method | Route             | Auth         | Description                          |
| ------ | ----------------- | ------------ | ------------------------------------- |
| POST   | `/auth/login`      | —            | Log in, returns a JWT                 |
| GET    | `/projects`        | —            | List all projects                     |
| POST   | `/projects`        | admin        | Create a project                      |
| PUT    | `/projects/:id`    | admin        | Update a project                      |
| DELETE | `/projects/:id`    | admin        | Delete a project                      |
| GET    | `/vlogs`           | —            | List guide posts (`?tag=`, `?category=`) |
| POST   | `/vlogs`           | admin        | Create a guide post                   |
| PUT    | `/vlogs/:id`       | admin        | Update a guide post                   |
| DELETE | `/vlogs/:id`       | admin        | Delete a guide post                   |
| POST   | `/upload`          | admin        | Upload an image (multipart `image` field), returns its Cloudinary URL |

Protected routes require `Authorization: Bearer <token>` from `/auth/login`.

## Project structure

```
src/
  server.js          entry point — loads .env, connects to Mongo, starts Express
  app.js              Express app: middleware, routes, error handling
  config/             db.js (Mongoose connection), cloudinary.js
  models/             User, Project, Vlog (Mongoose schemas)
  controllers/         request handlers per resource
  routes/              route definitions per resource
  middleware/           auth (JWT + admin check), validate (Zod), error handler
  schemas/             Zod schemas for request validation
scripts/
  seed-admin.js         one-off CLI script to create/reset the admin login
```

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB connection string (e.g. MongoDB Atlas)
- A Cloudinary account (for image uploads)

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
MONGO_URI=<your MongoDB connection string>
PORT=4000
JWT_SECRET=<a long random string>
CLIENT_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
```

`CLIENT_ORIGIN` must exactly match the frontend's origin — CORS will reject
requests from anywhere else. If you deploy the frontend somewhere new, update
this value there too (on Render, set it as an environment variable in the
dashboard — it doesn't read this repo's local `.env`).

### Run

```bash
npm start          # start the server
npm run dev         # start with --watch (auto-restart on file changes)
```

### Create the first admin user

There's no sign-up endpoint by design. Seed the first (or reset an existing)
admin login directly:

```bash
npm run seed:admin -- <username> <password>
```

This hashes the password with bcrypt and upserts a `User` document in
whatever database `MONGO_URI` points at. Log in at the frontend's `/login`
with those credentials afterward.

## Security notes

- Passwords are bcrypt-hashed; JWTs expire after 1 day.
- All write routes (`POST`/`PUT`/`DELETE`) require a valid token **and** an
  `admin` role.
- Request bodies are validated with Zod schemas (`src/schemas/`), which also
  strip unknown fields.
- `/auth/login` has a dedicated rate limiter (10 requests / 15 min) on top of
  the global one (100 requests / 15 min).
- Uploaded files are limited to 5MB, image MIME types only, and the local
  temp copy is deleted immediately after forwarding to Cloudinary.
