"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreProvider";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, skipAuth } = useStore();

  const onSkip = () => {
    skipAuth();
    router.push("/products");
  };

  return (
    <section className="card hero-card">
      <h1>Welcome to Local Business Shop</h1>
      <p>
        Buy curated items from local businesses. You can browse and add to cart now, then sign up or login
        when you place your order.
      </p>

      <div className="hero-actions">
        <Link className="btn" href="/auth?mode=login">
          Login
        </Link>
        <Link className="btn btn-outline" href="/auth?mode=signup">
          Sign up
        </Link>
        {!isAuthenticated && (
          <button type="button" className="btn btn-ghost" onClick={onSkip}>
            Skip for now
          </button>
        )}
      </div>

      <Link href="/products" className="link-inline">
        Continue to products →
      </Link>
    </section>
  );
}
