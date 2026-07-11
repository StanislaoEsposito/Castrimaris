"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

/* ─────────────────────────────────────────────────────────────────────────
   SUBMIT BUTTON — legge lo stato pending dal context del <form>
   ───────────────────────────────────────────────────────────────────────── */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      id="login-submit-btn"
      type="submit"
      disabled={pending}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.875rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#fff",
        backgroundColor: pending
          ? "var(--color-burgundy-light)"
          : "var(--color-burgundy)",
        border: "none",
        borderRadius: "var(--radius-md)",
        padding: "0.8rem 1.5rem",
        cursor: pending ? "not-allowed" : "pointer",
        width: "100%",
        marginTop: "0.25rem",
        transition: "background-color 0.2s ease, transform 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
      className={pending ? "" : "login-btn"}
    >
      {pending && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
          style={{ animation: "spin 0.8s linear infinite" }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      {pending ? "Accesso in corso…" : "Entra"}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   LOGIN FORM — Client Component
   Gestisce useActionState (React 19) per ricevere errori dalla Server Action
   ───────────────────────────────────────────────────────────────────────── */
export default function LoginForm() {
  const initialState: LoginState = { error: null };
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <>
      {/* ── Messaggio di errore ── */}
      {state.error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(114,47,55,0.07)",
            border: "1px solid rgba(114,47,55,0.25)",
            borderRadius: "var(--radius-md)",
            padding: "0.7rem 0.875rem",
            marginBottom: "1.25rem",
            color: "var(--color-burgundy)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.83rem",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {state.error}
        </div>
      )}

      {/* ── Form ── */}
      <form
        action={formAction}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {/* Campo Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label
            htmlFor="email"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-ink-light)",
            }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nome@esempio.it"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--color-ink)",
              backgroundColor: "#fff",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.65rem 0.875rem",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              width: "100%",
            }}
            className="login-input"
          />
        </div>

        {/* Campo Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label
            htmlFor="password"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-ink-light)",
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--color-ink)",
              backgroundColor: "#fff",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.65rem 0.875rem",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              width: "100%",
            }}
            className="login-input"
          />
        </div>

        <SubmitButton />
      </form>

      {/* ── Stili CSS (focus, hover, spinner) ── */}
      <style>{`
        .login-input:focus {
          border-color: var(--color-burgundy) !important;
          box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.12);
        }
        .login-input::placeholder {
          color: var(--color-border);
        }
        .login-btn:hover {
          background-color: var(--color-burgundy-dark) !important;
          transform: translateY(-1px);
        }
        .login-btn:active {
          transform: translateY(0);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
