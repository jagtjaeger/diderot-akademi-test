"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SUBJECTS, getSubject } from "@/lib/subjects";
import { askDideron } from "@/lib/dideron";

type Msg = { role: "user" | "ai"; text: string };

const LEVELS = [
  { min: 0, name: "Nyfiken Utforskare" },
  { min: 100, name: "First Principles Tänkare" },
  { min: 250, name: "Polymath" },
  { min: 500, name: "Mars Architect" },
  { min: 900, name: "Multiplanetary Builder" },
];

function getLevel(total: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (total >= l.min) current = l;
  }
  const next = LEVELS.find((l) => l.min > total);
  const progressToNext = next
    ? Math.min(100, ((total - current.min) / (next.min - current.min)) * 100)
    : 100;
  return { ...current, next, progressToNext, total };
}

export default function Home() {
  const [subjectId, setSubjectId] = useState("matte");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [curiosity, setCuriosity] = useState(0);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const subject = getSubject(subjectId);
  const level = getLevel(curiosity);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      setStarted(true);
      setInput("");
      setMessages((m) => [...m, { role: "user", text: trimmed }]);
      setLoading(true);
      try {
        const { text: reply, points } = await askDideron(trimmed, subject.label);
        setMessages((m) => [...m, { role: "ai", text: reply }]);
        setCuriosity((c) => c + points);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "ai", text: "Dideron kunde inte svara just nu. Försök igen om en stund." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, subject.label]
  );

  const welcome = () => {
    setStarted(true);
    setMessages([
      {
        role: "ai",
        text:
          `📜 Dideron · ${subject.label}\n\n` +
          `Välkommen. Jag är Dideron – din guide i Diderot Akademi.\n\n` +
          `Vi lär oss med DILM:\n` +
          `🟢 Konkret → 🔵 Representationell → 🟣 Abstrakt → 🟡 Reflektion\n\n` +
          `Allt utgår från ditt intresse. Välj en snabbfråga eller skriv fritt.\n` +
          `Varje genomtänkt svar ger Curiosity-poäng.`,
      },
    ]);
  };

  return (
    <div>
      <div className="container">
        <header className="site-header">
          <div className="logo">
            <div className="logo-mark">D</div>
            <span className="font-serif">
              Diderot <span className="gold">Akademi</span>
            </span>
          </div>
          <div className="muted" style={{ fontSize: "0.85rem" }}>
            DILA · Testapp
          </div>
        </header>

        {!started ? (
          <>
            <section className="hero">
              <div className="badge-row">
                <span className="badge gold-badge">DILA Architecture</span>
                <span className="badge">3D-pedagogik</span>
                <span className="badge">Curiosity Engine</span>
                <span className="badge">Skolverket åk 7–9</span>
              </div>
              <h1 className="font-serif">
                Kunskap som <span className="gold">befriar</span>
              </h1>
              <p className="tagline">
                Encyclopédie 2.0 – lär dig matematik, naturvetenskap och mer
                utifrån det du redan bryr dig om. First principles för varje sinne.
              </p>
              <button className="btn btn-gold" onClick={welcome}>
                Starta med Dideron →
              </button>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
              <p className="section-title">DILM – fyra faser</p>
              <div className="dilm-steps">
                <div className="dilm-step">
                  <div className="num">01</div>
                  <div className="name">🟢 Konkret</div>
                  <p className="muted" style={{ fontSize: "0.75rem", marginTop: 4 }}>Vardag & intresse</p>
                </div>
                <div className="dilm-step">
                  <div className="num">02</div>
                  <div className="name">🔵 Representation</div>
                  <p className="muted" style={{ fontSize: "0.75rem", marginTop: 4 }}>Bild, modell, analogi</p>
                </div>
                <div className="dilm-step">
                  <div className="num">03</div>
                  <div className="name">🟣 Abstrakt</div>
                  <p className="muted" style={{ fontSize: "0.75rem", marginTop: 4 }}>First principles</p>
                </div>
                <div className="dilm-step">
                  <div className="num">04</div>
                  <div className="name">🟡 Reflektion</div>
                  <p className="muted" style={{ fontSize: "0.75rem", marginTop: 4 }}>Metakognition</p>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <p className="section-title">Välj ämne</p>
              <div className="subject-grid">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    className={`subject-pill ${subjectId === s.id ? "active" : ""}`}
                    onClick={() => setSubjectId(s.id)}
                    type="button"
                  >
                    <span className="emoji">{s.emoji}</span>
                    <span className="label">{s.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="card" style={{ marginBottom: "2rem" }}>
              <p className="section-title">Exempel – Matematik × fotboll</p>
              <p style={{ marginBottom: "0.75rem" }}>
                <strong className="gold">Uppgift:</strong> Ett lag har 12 mål på 20 skott. Hur många procent blev mål?
              </p>
              <p className="muted" style={{ fontSize: "0.9rem" }}>
                Dideron svarar i fyra lager: konkret (matchen) → representation (bråk/diagram) →
                abstrakt (andel = del/helhet × 100) → reflektion. Det är DILA i praktiken.
              </p>
            </section>
          </>
        ) : (
          <div className="grid-2" style={{ paddingTop: "1rem" }}>
            <aside>
              <div className="curiosity-bar-wrap" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="section-title" style={{ margin: 0 }}>Curiosity Engine</span>
                  <span className="gold" style={{ fontWeight: 700 }}>{curiosity} XP</span>
                </div>
                <div className="curiosity-track">
                  <div className="curiosity-fill" style={{ width: `${level.progressToNext}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                  <span className="gold">{level.name}</span>
                  <span className="muted">
                    {level.next ? `${level.next.min - curiosity} till ${level.next.name}` : "Maxnivå"}
                  </span>
                </div>
              </div>

              <p className="section-title">Ämne</p>
              <div className="subject-grid" style={{ marginBottom: "1.25rem" }}>
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    className={`subject-pill ${subjectId === s.id ? "active" : ""}`}
                    onClick={() => setSubjectId(s.id)}
                    type="button"
                  >
                    <span className="emoji">{s.emoji}</span>
                    <span className="label">{s.label}</span>
                  </button>
                ))}
              </div>

              <p className="section-title">Snabbfrågor · {subject.label}</p>
              <div className="quick-prompts">
                {subject.prompts.map((p) => (
                  <button key={p} type="button" className="quick-prompt" onClick={() => send(p)} disabled={loading}>
                    {p}
                  </button>
                ))}
              </div>
            </aside>

            <div className="chat-shell">
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                    {msg.text}
                  </div>
                ))}
                {loading && (
                  <div className="bubble bubble-ai">
                    <div className="typing"><span /><span /><span /></div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <form
                className="chat-input-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Fråga Dideron om ${subject.label}…`}
                  disabled={loading}
                  aria-label="Meddelande"
                />
                <button type="submit" className="btn btn-gold" disabled={loading || !input.trim()}>
                  Skicka
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="site-footer">
        <p className="font-serif gold" style={{ marginBottom: 6 }}>
          Diderot Integrated Learning Architecture (DILA)
        </p>
        <p>Interest Anchor · DILM · Curiosity Engine · First Principles</p>
        <p style={{ marginTop: 8, fontSize: "0.8rem" }}>
          Testapp · Encyclopédie 2.0 · Kunskap som befriar
        </p>
      </footer>
    </div>
  );
}
