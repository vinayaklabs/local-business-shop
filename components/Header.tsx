"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/components/StoreProvider";

const isActive = (path: string, pathname: string) => pathname === path;

export function Header() {
  const pathname = usePathname();
  const { cartCount, isAuthenticated, account, toggleTheme, theme, logout } = useStore();

  return (
    <header className="header">
      <div className="container nav-row">
        <Link href="/" className="brand">
          Local Business Shop
        </Link>
        <nav className="nav-links">
          <Link className={isActive("/products", pathname) ? "active" : ""} href="/products">
            Products
          </Link>
          <Link className={isActive("/cart", pathname) ? "active" : ""} href="/cart">
            Cart <span className="badge">{cartCount}</span>
          </Link>
          <Link className={isActive("/auth", pathname) ? "active" : ""} href="/auth">
            {isAuthenticated ? account?.fullName || "Profile" : "Login / Signup"}
          </Link>
        </nav>
        <div className="nav-actions">
          <button type="button" className="btn btn-outline" onClick={toggleTheme}>
            {theme === "light" ? "Dark" : "Light"} Theme
          </button>
          {isAuthenticated && (
            <button type="button" className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
