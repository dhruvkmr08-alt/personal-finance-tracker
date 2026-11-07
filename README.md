# Personal Finance Tracker (MERN)

A beginner-friendly full-stack finance tracker built for the DevCamp 2.0 required features. Optional bonus features are intentionally excluded.

## Requirements
- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection string

## 1. Backend setup
Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env` and update the values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/personal_finance_tracker
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend setup
Open another terminal in `frontend`:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start React:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 3. First use
1. Register a new account.
2. Log in.
3. Add income and expense transactions.
4. Set a monthly budget.
5. Add or manage expense categories.

## API overview
- `POST /api/auth/register` - create account
- `POST /api/auth/login` - login
- `GET /api/auth/me` - current user
- `GET /api/dashboard` - dashboard totals and recent transactions
- `/api/transactions` - transaction CRUD and filters
- `/api/categories` - category list/create/delete
- `/api/budget` - get or set monthly budget

All finance endpoints require `Authorization: Bearer <token>`. Each query is restricted to the logged-in user's records.

## Notes
- Never commit your `.env` file or publish your JWT secret.
- The app stores money as JavaScript numbers for a simple learning project. For a production finance application, use integer minor units (paise/cents) or Decimal128 and add stronger security/testing.
