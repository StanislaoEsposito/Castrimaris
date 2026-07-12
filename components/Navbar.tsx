"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home",      href: "/" },
  { label: "Archivio", href: "/archivio" },
  { label: "L'Autore", href: "/autore" },
];

/* ─────────────────────────────────────────────────────────────────────────
   NAVBAR — Client Component
   Usa classi Tailwind (hidden/block/flex) per responsive perché sono
   CSS globali compilate → più affidabili del <style> inline in body.
   ───────────────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled,  setScrolled] = useState(false);

  /* ── Rileva scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Chiude menu su resize → desktop ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Blocca scroll body quando menu mobile aperto ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        /* Sfondo sempre papyrus con fallback hex — mai nero */
        backgroundColor: "#F9F8F6",
        borderBottom: "1px solid #e8e3d8",
        boxShadow: scrolled ? "0 2px 20px rgba(51,33,33,0.09)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* ── Barra decorativa superiore burgundy/gold ── */}
      <div
        aria-hidden="true"
        style={{
          height: 3,
          background: "linear-gradient(to right, #722F37, #C9A84C, #722F37)",
        }}
      />

      {/* ── Riga principale navbar ── */}
      <nav
        aria-label="Navigazione principale"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4rem",
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          aria-label="Castrimaris — torna alla home"
          className="logo-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
          }}
        >
          {/* Foglia Aldina */}
          <span style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "2.1rem",
            color: "var(--color-gold, #C9A84C)",
            lineHeight: 1,
            marginTop: "-0.2rem",
          }} aria-hidden="true">
            ❧
          </span>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}>
            <span style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "1.45rem",
              fontWeight: 600,
              color: "#333333",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}>
              Castrimaris
            </span>
            <span style={{
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              fontSize: "0.58rem",
              fontWeight: 400,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#888",
              marginTop: "1px",
            }}>
              Archivio Notarile
            </span>
          </div>
        </Link>

        {/* ── DESKTOP LINKS (hidden su mobile via Tailwind) ── */}
        <ul
          aria-label="Link di navigazione"
          className="hidden md:flex"
          style={{
            alignItems: "center",
            gap: "0.25rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link"
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "#555",
                  padding: "0.375rem 0.85rem",
                  borderRadius: "6px",
                  display: "inline-block",
                  textDecoration: "none",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── HAMBURGER (visible solo su mobile via Tailwind) ── */}
        <button
          id="hamburger-btn"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex md:hidden"
          style={{
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            color: "#333333",
            borderRadius: "6px",
          }}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </nav>

      {/* ── MENU MOBILE — accordion animato ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu di navigazione mobile"
        aria-modal="true"
        aria-hidden={!menuOpen}
        className="md:hidden"
        style={{
          overflow: "hidden",
          maxHeight: menuOpen ? "320px" : "0",
          opacity: menuOpen ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.28s ease",
          borderTop: menuOpen ? "1px solid #e8e3d8" : "none",
          backgroundColor: "#F9F8F6",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "0.75rem 1.25rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link"
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "#333333",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.7rem 0.85rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .logo-link:hover span:first-child { color: #722F37 !important; }
        .nav-link:hover {
          color: #722F37 !important;
          background-color: rgba(114,47,55,0.06) !important;
        }
        .mobile-nav-link:hover {
          color: #722F37 !important;
          background-color: rgba(114,47,55,0.06) !important;
        }
      `}</style>
    </header>
  );
}

/* ── Icona hamburger / X ── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{ transition: "transform 0.2s ease" }}
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6"  x2="21" y2="6"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}
