"use client";

import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/AuthPanel";
import { useStore } from "@/components/StoreProvider";

export function AuthPageClient({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { isAuthenticated, account } = useStore();

  if (isAuthenticated) {
    return (
      <section className="card">
        <h1>Profile</h1>
        <p>Logged in as {account?.fullName}.</p>
        <button type="button" className="btn" onClick={() => router.push("/products")}>
          Continue shopping
        </button>
      </section>
    );
  }

  return <AuthPanel initialMode={mode} title="Login or sign up" onSuccess={() => router.push("/products")} />;
}
