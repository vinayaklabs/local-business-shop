"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import { formatCurrency } from "@/lib/format";
import { SAMPLE_PRODUCTS } from "@/lib/products";

export default function CartPage() {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart } = useStore();

  const lines = cart
    .map((item) => ({
      ...item,
      product: SAMPLE_PRODUCTS.find((product) => product.id === item.productId),
    }))
    .filter((item) => item.product);

  if (lines.length === 0) {
    return (
      <section className="card">
        <h1>Your cart is empty</h1>
        <p>Add items from the products page to continue.</p>
        <Link href="/products" className="btn">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="stack">
      <h1>Cart</h1>
      <div className="stack">
        {lines.map(({ product, quantity }) => (
          <article className="card cart-item" key={product!.id}>
            <div>
              <h3>{product!.name}</h3>
              <p className="muted">{formatCurrency(product!.price)} each</p>
            </div>

            <div className="cart-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => updateCartQuantity(product!.id, quantity - 1)}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => updateCartQuantity(product!.id, quantity + 1)}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => removeFromCart(product!.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="card total-card">
        <p>
          Subtotal: <strong>{formatCurrency(cartSubtotal)}</strong>
        </p>
        <p className="muted">Shipping and taxes are calculated at checkout.</p>
        <Link href="/checkout" className="btn">
          Proceed to checkout
        </Link>
      </section>
    </section>
  );
}
