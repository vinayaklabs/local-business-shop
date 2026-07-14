"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import { formatCurrency } from "@/lib/format";

export default function OrderConfirmationPage() {
  const { lastOrder } = useStore();

  if (!lastOrder) {
    return (
      <section className="card">
        <h1>No recent order found</h1>
        <Link href="/products" className="btn">
          Shop now
        </Link>
      </section>
    );
  }

  return (
    <section className="card">
      <h1>Order confirmed ✅</h1>
      <p>Your order {lastOrder.id} has been placed successfully.</p>
      <p>
        Total paid: <strong>{formatCurrency(lastOrder.total)}</strong>
      </p>
      <p>
        Delivering to: {lastOrder.delivery.fullName}, {lastOrder.delivery.addressLine}, {lastOrder.delivery.city},
        {" "}
        {lastOrder.delivery.state} {lastOrder.delivery.postalCode}
      </p>
      <Link href="/products" className="btn">
        Continue shopping
      </Link>
    </section>
  );
}
