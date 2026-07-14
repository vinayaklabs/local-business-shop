"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreProvider";

type Mode = "login" | "signup";

type AuthPanelProps = {
  initialMode?: Mode;
  title?: string;
  onSuccess?: () => void;
};

export function AuthPanel({ initialMode = "login", title = "Continue", onSuccess }: AuthPanelProps) {
  const { login, signup } = useStore();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || (mode === "signup" && !fullName.trim())) {
      setError("Please complete all required fields.");
      return;
    }

    const result =
      mode === "signup"
        ? signup({ fullName: fullName.trim(), email: email.trim(), password: password.trim() })
        : login(email.trim(), password.trim());

    if (!result.ok) {
      setError(result.message || "Authentication failed.");
      return;
    }

    setError("");
    onSuccess?.();
  };

  return (
    <section className="card auth-card">
      <h2>{title}</h2>
      <div className="mode-toggle">
        <button
          type="button"
          className={mode === "login" ? "btn" : "btn btn-outline"}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === "signup" ? "btn" : "btn btn-outline"}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      <form className="form" onSubmit={submit}>
        {mode === "signup" && (
          <label>
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">
          {mode === "signup" ? "Create account" : "Login"}
        </button>
      </form>
    </section>
  );
}
