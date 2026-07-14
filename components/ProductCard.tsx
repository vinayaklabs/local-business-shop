"use client";

import { useStore } from "@/components/StoreProvider";
import { formatCurrency } from "@/lib/format";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <article className="card product-card">
      <div className="emoji" aria-hidden>
        {product.image}
      </div>
      <p className="muted">{product.category}</p>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-footer">
        <strong>{formatCurrency(product.price)}</strong>
        <button type="button" className="btn" onClick={() => addToCart(product.id)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
