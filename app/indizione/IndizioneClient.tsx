"use client";

import { useState, useMemo } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   LOGICA CALCOLO INDIZIONE
   ───────────────────────────────────────────────────────────────────────── */
function computeIndizioni(dateStr: string): {
  base: number | null;
  nativita: number | null;
  error: string | null;
} {
  const parts = dateStr.trim().split("/");
  if (parts.length !== 3) return { base: null, nativita: null, error: "Formato non valido." };

  const day   = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year  = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return { base: null, nativita: null, error: "Inserire numeri validi." };
  }
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1) {
    return { base: null, nativita: null, error: "Data non valida." };
  }

  // ── Senza Stile della Natività ──────────────────────────────────────────
  let base: number;
  if (month >= 9) {
    base = ((year + 3) % 15) + 1;
  } else {
    base = (year + 3) % 15;
    if (base === 0) base = 15;
  }

  // ── Secondo lo Stile della Natività ────────────────────────────────────
  let nativita: number;
  if (month >= 9) {
    const offset = month === 12 && day >= 25 ? 1 : 0;
    nativita = ((year - offset + 3) % 15) + 1;
  } else {
    nativita = (year + 3) % 15;
    if (nativita === 0) nativita = 15;
  }

  return { base, nativita, error: null };
}

/* ─────────────────────────────────────────────────────────────────────────
   DATI TABELLA STORICA — Indizione Regno di Napoli (Greco-Bizantina)
   
   Struttura: ogni riga = { suffix, period, romanA, romanB, romanC }
   suffix: 2 cifre terminali (0-14) × 2 periodi = 30 righe
   period: "gen" (1° gen–31 ago) | "sett" (1° sett–31 dic)
   romanA: indizione per secoli in cui (sec/100) % 3 === 0  → 300,600,900,1200,1500,1800
   romanB: indizione per secoli in cui (sec/100) % 3 === 1  → 400,700,1000,1300,1600,1900
   romanC: indizione per secoli in cui (sec/100) % 3 === 2  → 500,800,1100,1400,1700,2000
   ───────────────────────────────────────────────────────────────────────── */
type TableRow = {
  suffix: string;   // "00", "01" … "14"
  period: "gen" | "sett";
  romanA: string;
  romanB: string;
  romanC: string;
};

const TABLE_DATA: TableRow[] = [
  // suffix 0
  { suffix: "00", period: "gen",  romanA: "III",  romanB: "XIII", romanC: "VIII" },
  { suffix: "00", period: "sett", romanA: "IV",   romanB: "XIV",  romanC: "IX"   },
  // suffix 01
  { suffix: "01", period: "gen",  romanA: "IV",   romanB: "XIV",  romanC: "IX"   },
  { suffix: "01", period: "sett", romanA: "V",    romanB: "XV",   romanC: "X"    },
  // suffix 02
  { suffix: "02", period: "gen",  romanA: "V",    romanB: "XV",   romanC: "X"    },
  { suffix: "02", period: "sett", romanA: "VI",   romanB: "I",    romanC: "XI"   },
  // suffix 03
  { suffix: "03", period: "gen",  romanA: "VI",   romanB: "I",    romanC: "XI"   },
  { suffix: "03", period: "sett", romanA: "VII",  romanB: "II",   romanC: "XII"  },
  // suffix 04
  { suffix: "04", period: "gen",  romanA: "VII",  romanB: "II",   romanC: "XII"  },
  { suffix: "04", period: "sett", romanA: "VIII", romanB: "III",  romanC: "XIII" },
  // suffix 05
  { suffix: "05", period: "gen",  romanA: "VIII", romanB: "III",  romanC: "XIII" },
  { suffix: "05", period: "sett", romanA: "IX",   romanB: "IV",   romanC: "XIV"  },
  // suffix 06
  { suffix: "06", period: "gen",  romanA: "IX",   romanB: "IV",   romanC: "XIV"  },
  { suffix: "06", period: "sett", romanA: "X",    romanB: "V",    romanC: "XV"   },
  // suffix 07
  { suffix: "07", period: "gen",  romanA: "X",    romanB: "V",    romanC: "XV"   },
  { suffix: "07", period: "sett", romanA: "XI",   romanB: "VI",   romanC: "I"    },
  // suffix 08
  { suffix: "08", period: "gen",  romanA: "XI",   romanB: "VI",   romanC: "I"    },
  { suffix: "08", period: "sett", romanA: "XII",  romanB: "VII",  romanC: "II"   },
  // suffix 09
  { suffix: "09", period: "gen",  romanA: "XII",  romanB: "VII",  romanC: "II"   },
  { suffix: "09", period: "sett", romanA: "XIII", romanB: "VIII", romanC: "III"  },
  // suffix 10
  { suffix: "10", period: "gen",  romanA: "XIII", romanB: "VIII", romanC: "III"  },
  { suffix: "10", period: "sett", romanA: "XIV",  romanB: "IX",   romanC: "IV"   },
  // suffix 11
  { suffix: "11", period: "gen",  romanA: "XIV",  romanB: "IX",   romanC: "IV"   },
  { suffix: "11", period: "sett", romanA: "XV",   romanB: "X",    romanC: "V"    },
  // suffix 12
  { suffix: "12", period: "gen",  romanA: "XV",   romanB: "X",    romanC: "V"    },
  { suffix: "12", period: "sett", romanA: "I",    romanB: "XI",   romanC: "VI"   },
  // suffix 13
  { suffix: "13", period: "gen",  romanA: "I",    romanB: "XI",   romanC: "VI"   },
  { suffix: "13", period: "sett", romanA: "II",   romanB: "XII",  romanC: "VII"  },
  // suffix 14
  { suffix: "14", period: "gen",  romanA: "II",   romanB: "XII",  romanC: "VII"  },
  { suffix: "14", period: "sett", romanA: "III",  romanB: "XIII", romanC: "VIII" },
];

// Colonne della tabella principale (valori base delle decine nel ciclo di 100)
const MAIN_COLS = [0, 15, 30, 45, 60, 75, 90];

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPALE
   ───────────────────────────────────────────────────────────────────────── */
export default function IndizioneClient() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return computeIndizioni(input);
  }, [input]);

  const toRoman = (n: number): string => {
    const map = [
      [15, "XV"], [14, "XIV"], [13, "XIII"], [12, "XII"],
      [11, "XI"], [10, "X"],  [9, "IX"],    [8, "VIII"],
      [7, "VII"], [6, "VI"],  [5, "V"],     [4, "IV"],
      [3, "III"], [2, "II"],  [1, "I"],
    ] as [number, string][];
    return map.find(([v]) => v === n)?.[1] ?? String(n);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-papyrus)",
        color: "var(--color-ink)",
      }}
    >
      {/* ── Hero testuale ────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(to bottom, #F0EDE7, var(--color-papyrus))",
          borderBottom: "1px solid var(--color-border)",
          padding: "3rem 1.5rem 2.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {/* Ornamento */}
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              color: "var(--color-gold)",
              marginBottom: "0.75rem",
              letterSpacing: "0.2em",
            }}
            aria-hidden="true"
          >
            ✦ ✦ ✦
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: "0 0 0.6rem",
              lineHeight: 1.15,
            }}
          >
            Calcolatore dell&apos;Indizione Bizantina
          </h1>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              color: "#666",
              margin: "0 0 0.5rem",
              lineHeight: 1.7,
              maxWidth: "560px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Strumento per la datazione critica di documenti medievali e moderni.
            Calcola l&apos;indizione secondo il sistema <em>Greco-Bizantino</em> (anno
            iniziante il 1° settembre) e secondo lo <em>Stile della Natività</em>{" "}
            (anno iniziante il 25 dicembre), in uso nel{" "}
            <strong>Regno di Napoli</strong>.
          </p>

          <div
            aria-hidden="true"
            style={{
              width: "4rem",
              height: "2px",
              background: "linear-gradient(to right, var(--color-gold), #C9A84C88)",
              borderRadius: "2px",
              margin: "1.25rem auto 0",
            }}
          />
        </div>
      </section>

      {/* ── Calcolatore ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="calc-heading"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "2.5rem 1.25rem",
        }}
      >
        <h2
          id="calc-heading"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#94a3b8",
            margin: "0 0 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "1.5rem",
              height: "1px",
              backgroundColor: "var(--color-gold)",
            }}
          />
          Calcolatore Interattivo
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "1.5rem",
              height: "1px",
              backgroundColor: "var(--color-gold)",
            }}
          />
        </h2>

        {/* Card calcolatore */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            padding: "1.75rem",
            boxShadow: "0 2px 12px rgba(51,33,33,0.06)",
          }}
        >
          {/* Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="date-input"
              style={{
                display: "block",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                marginBottom: "0.5rem",
              }}
            >
              Data storica (GG/MM/AAAA)
            </label>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                id="date-input"
                type="text"
                inputMode="numeric"
                placeholder="es. 25/12/1422"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flex: "1 1 180px",
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.05rem",
                  color: "var(--color-ink)",
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "0.65rem 1rem",
                  outline: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  letterSpacing: "0.04em",
                }}
                className="indizione-input"
                aria-describedby={result?.error ? "date-error" : undefined}
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                    background: "none",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    padding: "0.65rem 1rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className="clear-btn"
                >
                  Cancella
                </button>
              )}
            </div>
            {result?.error && (
              <p
                id="date-error"
                role="alert"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  color: "#dc2626",
                  marginTop: "0.4rem",
                }}
              >
                ⚠ {result.error}
              </p>
            )}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.73rem",
                color: "#94a3b8",
                marginTop: "0.4rem",
                fontStyle: "italic",
              }}
            >
              Inserisci giorno, mese e anno nel formato numerico (es. 03/09/1350)
            </p>
          </div>

          {/* Risultati — layout flex che si impila su mobile */}
          <div
            className="result-grid"
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {/* Box 1: Senza stile natività */}
            <ResultBox
              label="Senza Stile della Natività"
              sublabel="Anno iniziante il 1° settembre"
              value={result?.base != null ? toRoman(result.base) : null}
              numValue={result?.base ?? null}
              accent="burgundy"
            />
            {/* Box 2: Secondo stile natività */}
            <ResultBox
              label="Secondo lo Stile della Natività"
              sublabel="Anno iniziante il 25 dicembre"
              value={result?.nativita != null ? toRoman(result.nativita) : null}
              numValue={result?.nativita ?? null}
              accent="gold"
            />
          </div>
        </div>

        {/* Nota esplicativa */}
        <div
          style={{
            marginTop: "1rem",
            padding: "0.9rem 1.1rem",
            backgroundColor: "#fffbf0",
            border: "1px solid #f0e0a0",
            borderRadius: "8px",
            display: "flex",
            gap: "0.6rem",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: "1px" }}
            aria-hidden="true"
          >
            💡
          </span>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "#78604a",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong>Come si usa:</strong> L&apos;indizione è un ciclo di 15 anni usato
            nella datazione medievale. Per documenti del Regno di Napoli anteriori
            al 1582, è preferibile il metodo <em>Greco-Bizantino</em>. Lo{" "}
            <em>Stile della Natività</em> sposta l&apos;inizio anno al 25 dicembre:
            per date tra il 25 dic. e il 31 dic. i due valori possono differire.
          </p>
        </div>
      </section>

      {/* ── Separatore ornamentale ────────────────────────────────────────── */}
      <div
        className="ornament-divider"
        style={{ maxWidth: "860px", margin: "0 auto 0", padding: "0 1.25rem" }}
        aria-hidden="true"
      >
        ❦
      </div>

      {/* ── Tabella storica ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="table-heading"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
        }}
      >
        <h2
          id="table-heading"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
            fontWeight: 600,
            color: "var(--color-ink)",
            textAlign: "center",
            margin: "0 0 0.35rem",
          }}
        >
          Indizione Regno di Napoli (Greco-Bizantina)
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            color: "#94a3b8",
            textAlign: "center",
            margin: "0 0 1.5rem",
            fontStyle: "italic",
          }}
        >
          Tabella di riferimento storica — scorri orizzontalmente su mobile
        </p>

        {/* Wrapper scroll orizzontale su mobile */}
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "10px",
            boxShadow: "0 2px 16px rgba(51,33,33,0.07)",
            border: "1px solid var(--color-border)",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "680px",
              borderCollapse: "collapse",
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              backgroundColor: "#fff",
            }}
          >
            <thead>
              {/* Riga 1: header secoli (raggruppati per modulo 3) */}
              <tr>
                {/* Cella anno */}
                <th
                  colSpan={2}
                  rowSpan={2}
                  style={{
                    ...thStyle,
                    backgroundColor: "#f8f6f2",
                    borderRight: "2px solid var(--color-border)",
                    fontSize: "0.65rem",
                    textAlign: "center",
                    padding: "0.5rem 0.4rem",
                    verticalAlign: "middle",
                  }}
                >
                  <span style={{ color: "var(--color-ink)", fontWeight: 700 }}>ANNO</span>
                  <br />
                  <span style={{ color: "#94a3b8", fontWeight: 400 }}>(ultime 2 cifre)</span>
                </th>
                {/* Colonne principali */}
                {MAIN_COLS.map((c) => (
                  <th
                    key={c}
                    style={{
                      ...thStyle,
                      backgroundColor: "#f8f6f2",
                      color: "var(--color-burgundy)",
                      fontWeight: 700,
                      borderRight: c === 90 ? "2px solid var(--color-border)" : undefined,
                    }}
                  >
                    {c}
                  </th>
                ))}
                {/* Header secoli — tre colonne */}
                <th
                  style={{
                    ...thStyle,
                    backgroundColor: "#2d4a3e",
                    color: "#fff",
                    textAlign: "center",
                    letterSpacing: "0.08em",
                  }}
                >
                  <div style={{ fontSize: "0.6rem", lineHeight: 1.4 }}>
                    300 · 600 · 900
                    <br />
                    1200 · 1500 · 1800
                  </div>
                </th>
                <th
                  style={{
                    ...thStyle,
                    backgroundColor: "#2d3d4a",
                    color: "#fff",
                    textAlign: "center",
                    letterSpacing: "0.08em",
                  }}
                >
                  <div style={{ fontSize: "0.6rem", lineHeight: 1.4 }}>
                    400 · 700 · 1000
                    <br />
                    1300 · 1600 · 1900
                  </div>
                </th>
                <th
                  style={{
                    ...thStyle,
                    backgroundColor: "#3d2d4a",
                    color: "#fff",
                    textAlign: "center",
                    letterSpacing: "0.08em",
                  }}
                >
                  <div style={{ fontSize: "0.6rem", lineHeight: 1.4 }}>
                    500 · 800 · 1100
                    <br />
                    1400 · 1700 · 2000
                  </div>
                </th>
              </tr>
              {/* Riga 2: etichette PERIODO e INDIZIONE */}
              <tr>
                {MAIN_COLS.map((c) => (
                  <th
                    key={c}
                    style={{
                      ...thStyle,
                      backgroundColor: "#f0ede7",
                      fontSize: "0.58rem",
                      color: "#64748b",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      borderRight: c === 90 ? "2px solid var(--color-border)" : undefined,
                    }}
                  >
                    PERIODO
                  </th>
                ))}
                <th
                  style={{
                    ...thStyle,
                    backgroundColor: "#f0ede7",
                    fontSize: "0.6rem",
                    color: "#64748b",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  INDIZIONE
                </th>
                <th
                  style={{
                    ...thStyle,
                    backgroundColor: "#f0ede7",
                    fontSize: "0.6rem",
                    color: "#64748b",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  INDIZIONE
                </th>
                <th
                  style={{
                    ...thStyle,
                    backgroundColor: "#f0ede7",
                    fontSize: "0.6rem",
                    color: "#64748b",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  INDIZIONE
                </th>
              </tr>
            </thead>

            <tbody>
              {TABLE_DATA.map((row, idx) => {
                const isGen    = row.period === "gen";
                const isNewSuffix = idx === 0 || TABLE_DATA[idx - 1].suffix !== row.suffix;
                const rowBg    = Math.floor(idx / 2) % 2 === 0 ? "#fff" : "#faf9f7";
                const periodLabel = isGen
                  ? "1° gen. – 31 ago."
                  : "1° sett. – 31 dic.";
                const periodColor = isGen ? "#2d4a6a" : "#4a2d2d";

                return (
                  <tr key={`${row.suffix}-${row.period}`} style={{ backgroundColor: rowBg }}>
                    {/* Cella suffisso anno — solo per la prima riga del gruppo */}
                    {isNewSuffix && (
                      <td
                        rowSpan={2}
                        style={{
                          ...tdStyle,
                          fontFamily: "var(--font-serif)",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "var(--color-burgundy)",
                          textAlign: "center",
                          backgroundColor: isGen ? "#fff" : "#faf9f7",
                          borderRight: "1px solid var(--color-border)",
                          verticalAlign: "middle",
                          minWidth: "2.5rem",
                          padding: "0",
                        }}
                      >
                        {row.suffix === "00" ? "00" : row.suffix.replace(/^0/, "")}
                      </td>
                    )}

                    {/* Cella periodo */}
                    <td
                      style={{
                        ...tdStyle,
                        fontSize: "0.62rem",
                        fontStyle: "italic",
                        color: periodColor,
                        backgroundColor: isGen ? "#e8f0f8" : "#f8ece8",
                        borderRight: "2px solid var(--color-border)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        padding: "0.3rem 0.5rem",
                        minWidth: "5.5rem",
                      }}
                    >
                      {periodLabel}
                    </td>

                    {/* Celle principali: anno effettivo nel ciclo */}
                    {MAIN_COLS.map((base) => {
                      const yearEnd = base + parseInt(row.suffix, 10);
                      const isInvalid = yearEnd > 99;
                      return (
                        <td
                          key={base}
                          style={{
                            ...tdStyle,
                            textAlign: "center",
                            fontSize: "0.65rem",
                            color: isInvalid ? "#cbd5e1" : isGen ? "#1e3a5f" : "#5f1e1e",
                            backgroundColor: isInvalid
                              ? "#f8f8f8"
                              : isGen
                              ? "#eef4fb"
                              : "#fbeeed",
                            fontWeight: 500,
                            padding: "0.3rem 0.2rem",
                            borderRight: base === 90 ? "2px solid var(--color-border)" : undefined,
                          }}
                        >
                          {isInvalid ? (
                            <span style={{ color: "#ddd" }}>—</span>
                          ) : (
                            <>
                              <span style={{ display: "block", fontFamily: "var(--font-serif)", fontWeight: 700 }}>
                                {String(yearEnd).padStart(2, "0")}
                              </span>
                              <span style={{ display: "block", fontSize: "0.55rem", color: "#94a3b8", fontStyle: "italic" }}>
                                {isGen ? "gen–ago" : "sett–dic"}
                              </span>
                            </>
                          )}
                        </td>
                      );
                    })}

                    {/* Colonne indizione romane */}
                    {(["romanA", "romanB", "romanC"] as const).map((col, ci) => {
                      const colors = [
                        { bg: "#e8f0eb", text: "#1a3d2a", hdr: "#2d4a3e" },
                        { bg: "#e8edf5", text: "#1a2a3d", hdr: "#2d3d4a" },
                        { bg: "#ede8f5", text: "#2a1a3d", hdr: "#3d2d4a" },
                      ];
                      const c = colors[ci];
                      return (
                        <td
                          key={col}
                          style={{
                            ...tdStyle,
                            textAlign: "center",
                            fontFamily: "var(--font-serif)",
                            fontSize: "0.92rem",
                            fontWeight: 700,
                            backgroundColor: c.bg,
                            color: c.text,
                            letterSpacing: "0.02em",
                            padding: "0.35rem 0.5rem",
                          }}
                        >
                          {row[col]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { color: "#eef4fb", label: "1° gen. – 31 ago." },
            { color: "#fbeeed", label: "1° sett. – 31 dic." },
          ].map(({ color, label }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  backgroundColor: color,
                  border: "1px solid var(--color-border)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  color: "#64748b",
                  fontStyle: "italic",
                }}
              >
                {label}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                color: "#64748b",
              }}
            >
              <span style={{ color: "#ccc" }}>—</span> = combinazione non valida (anno &gt; 99)
            </span>
          </div>
        </div>
      </section>

      {/* ── Stili locali ─────────────────────────────────────────────────── */}
      <style>{`
        .indizione-input:focus {
          border-color: var(--color-burgundy) !important;
          box-shadow: 0 0 0 3px rgba(114,47,55,0.10) !important;
        }
        .clear-btn:hover {
          color: var(--color-burgundy) !important;
          border-color: var(--color-burgundy) !important;
        }
        @media (max-width: 600px) {
          .result-grid { flex-direction: column !important; }
        }
      `}</style>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENTE RISULTATO
   ───────────────────────────────────────────────────────────────────────── */
function ResultBox({
  label,
  sublabel,
  value,
  numValue,
  accent,
}: {
  label: string;
  sublabel: string;
  value: string | null;
  numValue: number | null;
  accent: "burgundy" | "gold";
}) {
  const accentColor = accent === "burgundy" ? "#722F37" : "#B89758";
  const bgColor     = accent === "burgundy" ? "#fdf6f7" : "#fdf9f2";
  const borderColor = accent === "burgundy" ? "rgba(114,47,55,0.2)" : "rgba(184,151,88,0.3)";

  return (
    <div
      style={{
        flex: "1 1 240px",
        backgroundColor: value ? bgColor : "#f8fafc",
        border: `1px solid ${value ? borderColor : "var(--color-border)"}`,
        borderRadius: "10px",
        padding: "1.25rem 1.5rem",
        textAlign: "center",
        transition: "all 0.25s ease",
        boxShadow: value ? `0 2px 12px ${borderColor}` : "none",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: value ? accentColor : "#94a3b8",
          margin: "0 0 0.2rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.65rem",
          color: "#94a3b8",
          fontStyle: "italic",
          margin: "0 0 0.9rem",
        }}
      >
        {sublabel}
      </p>

      {value ? (
        <>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "3rem",
              fontWeight: 600,
              color: accentColor,
              lineHeight: 1,
              marginBottom: "0.25rem",
              letterSpacing: "0.02em",
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              color: "#94a3b8",
            }}
          >
            Indizione n° {numValue}
          </div>
        </>
      ) : (
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2.5rem",
            color: "#e2e8f0",
            lineHeight: 1,
            letterSpacing: "0.05em",
          }}
          aria-label="In attesa di input"
        >
          —
        </div>
      )}
    </div>
  );
}

/* ── Stili helper per la tabella ── */
const thStyle: React.CSSProperties = {
  padding: "0.45rem 0.4rem",
  textAlign: "center",
  fontFamily: "var(--font-sans)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  border: "1px solid #e8e3d8",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ede9e3",
  verticalAlign: "middle",
  lineHeight: 1.3,
};
