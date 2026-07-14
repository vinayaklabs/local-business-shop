# Local Business Shop

A demo e-commerce app built with Next.js (App Router) + TypeScript for local businesses.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- Start screen with Login / Signup and **Skip for now**
- Product listing with sample products
- Light/Dark theme toggle persisted in localStorage
- Add to cart, quantity updates, remove item, cart subtotal
- Checkout gating: users can browse while skipped, but must login/signup before placing order
- Delivery form validation (full name, phone, address line, city, state, postal code)
- Order confirmation after successful purchase with cart cleared
- Header nav with Products, Cart badge, and Auth/Profile entry

## Scripts

- `npm run dev` – run app locally
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – lint code

## Manual verification checklist

1. Open app and click **Skip for now**.
2. Add products to cart and adjust quantities.
3. Go to checkout and confirm auth is required.
4. Sign up or log in, fill delivery details, and place order.
5. Confirm order success message appears and cart is cleared.
