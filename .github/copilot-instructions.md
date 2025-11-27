# Copilot Instructions for Payment Demo (MoMo Integration)

## Project Overview

- **Monorepo** with two main apps:
  - `backend/`: Node.js Express API (MoMo payment, order, product, user, cart, chat)
  - `frontend/`: React (Create React App) e-commerce UI
- **MoMo eWallet** integration is core: see `backend/src/services/MoMoPayment.js` for all payment logic and test bypasses.
- Data is in-memory or JSON files (no database by default).

## Key Workflows

- **Start backend**: `cd backend && npm run dev` (uses `.env` for config)
- **Start frontend**: `cd frontend && npm start`
- **Test MoMo sandbox**: Set `MOMO_ACCEPT_ANY_OTP_IN_TEST=true` in `backend/.env` to bypass OTP in test mode.
- **API endpoints**: See `README.md` for full list and usage examples.
- **Frontend dev**: Standard React workflow (`npm start`, `npm test`, etc.)

## Patterns & Conventions

- **Backend**
  - All business logic in `src/services/` (e.g., `MoMoPayment.js`)
  - API routes in `src/routes/`
  - Models in `src/models/`
  - No database: products/orders are in-memory or JSON
  - Logging and error handling are verbose for dev/test
- **Frontend**
  - Pages in `src/pages/`, components in `src/components/`
  - Context API for auth/cart state
  - API calls via `src/services/api.js`

## Integration & Extensibility

- **MoMo**: All payment logic and callback verification in `MoMoPayment.js`. Test mode can bypass OTP for rapid dev.
- **Add new payment methods**: Extend backend `routes/payment.js` and `services/`.
- **Add new product data**: Edit `backend/src/models/Product.js` or JSON files.

## Examples

- To add a new API route: create a file in `src/routes/`, register in `server.js`.
- To add a new React page: add to `src/pages/`, route in `App.js`.

## Troubleshooting

- If MoMo test always fails, check `.env` and logs in backend terminal.
- For CORS issues, set `FRONTEND_URL` in backend `.env`.

---

For more, see `README.md` and `PAYMENT_README.md` in the repo root.
