"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AuthPanel } from "@/components/AuthPanel";
import { useStore } from "@/components/StoreProvider";
import { formatCurrency } from "@/lib/format";
import { SAMPLE_PRODUCTS } from "@/lib/products";
import { DeliveryInfo } from "@/lib/types";

const REQUIRED_FIELDS: Array<keyof DeliveryInfo> = [
  "fullName",
  "phone",
  "addressLine",
  "city",
  "state",
  "postalCode",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, isAuthenticated, placeOrder, account } = useStore();
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    fullName: account?.fullName || "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryInfo, string>>>({});
  const [submitError, setSubmitError] = useState("");

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => ({
          quantity: item.quantity,
          product: SAMPLE_PRODUCTS.find((product) => product.id === item.productId),
        }))
        .filter((entry) => entry.product),
    [cart],
  );

  if (cartItems.length === 0) {
    return (
      <section className="card">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link href="/products" className="btn">
          Browse products
        </Link>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="stack">
        <section className="card">
          <h1>Checkout</h1>
          <p>Please login or sign up before placing your order.</p>
        </section>
        <AuthPanel title="Authenticate to continue" onSuccess={() => router.refresh()} />
      </section>
    );
  }

  const onChange = (field: keyof DeliveryInfo, value: string) => {
    setDelivery((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const nextErrors: Partial<Record<keyof DeliveryInfo, string>> = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!delivery[field].trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Please complete all required delivery details.");
      return;
    }

    const result = placeOrder(delivery);
    if (!result.ok) {
      setSubmitError(result.message || "Could not place order.");
      return;
    }

    router.push("/order-confirmation");
  };

  return (
    <section className="stack">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="card form" onSubmit={onSubmit}>
          <h2>Delivery information</h2>

          <label>
            Full name
            <input
              value={delivery.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              required
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </label>

          <label>
            Phone
            <input value={delivery.phone} onChange={(event) => onChange("phone", event.target.value)} required />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </label>

          <label>
            Address line
            <input
              value={delivery.addressLine}
              onChange={(event) => onChange("addressLine", event.target.value)}
              required
            />
            {errors.addressLine && <span className="error">{errors.addressLine}</span>}
          </label>

          <label>
            City
            <input value={delivery.city} onChange={(event) => onChange("city", event.target.value)} required />
            {errors.city && <span className="error">{errors.city}</span>}
          </label>

          <label>
            State
            <input value={delivery.state} onChange={(event) => onChange("state", event.target.value)} required />
            {errors.state && <span className="error">{errors.state}</span>}
          </label>

          <label>
            Postal code
            <input
              value={delivery.postalCode}
              onChange={(event) => onChange("postalCode", event.target.value)}
              required
            />
            {errors.postalCode && <span className="error">{errors.postalCode}</span>}
          </label>

          {submitError && <p className="error">{submitError}</p>}
          <button className="btn" type="submit">
            Place order
          </button>
        </form>

        <aside className="card">
          <h2>Order summary</h2>
          <div className="stack-sm">
            {cartItems.map(({ product, quantity }) => (
              <p key={product!.id}>
                {product!.name} × {quantity}
              </p>
            ))}
          </div>
          <hr />
          <p>
            Total: <strong>{formatCurrency(cartSubtotal)}</strong>
          </p>
        </aside>
      </div>
    </section>
  );
}
