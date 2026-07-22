"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SUBJECTS, getSubject } from "@/lib/subjects";
import { askDideron } from "@/lib/dideron";
import { lessonsForSubject } from "@/lib/lessons";

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
  const [source, setSource] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const subject = getSubject(subjectId);
  const level = getLevel(curiosity);
  const lessons = lessonsForSubject(subjectId);

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
        const history = messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        }));
        const { text: reply, points, source: src } = await askDideron(
          trimmed,
          subject.label,
          history
        );
        setSource(src);
        setMessages((m) => [...m, { role: "ai", text: reply }]);
        setCuriosity((c) => c + points);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "ai", text: "Dideron kunde inte svara just nu. Försök igen." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, subject.label, messages]
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
          `Välj en lektion eller snabbfråga, eller skriv fritt.\n` +
          `Varje svar ger Curiosity-poäng.`,
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
            DILA · {source === "groq" ? "Groq live" : "Testapp"}
          </div>
        </header>

        {!started ? (
          <>
            <section className="hero">
              <div className="badge-row">
                <span className="badge gold-badge">DILA Architecture</span>
                <span className="badge">3D-pedagogik</span>
                <span className="badge">Curiosity Engine</span>
                <span className="badge">19 lektioner</span>
              </div>
              <h1 className="font-serif">
                Kunskap som <span className="gold">befriar</span>
              </h1>
              <p className="tagline">
                Encyclopédie 2.0 – lär dig utifrån det du bryr dig om. First principles för varje sinne.
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
                </div>
                <div className="dilm-step">
                  <div className="num">02</div>
                  <div className="name">🔵 Representation</div>
                </div>
                <div className="dilm-step">
                  <div className="num">03</div>
                  <div className="name">🟣 Abstrakt</div>
                </div>
                <div className="dilm-step">
                  <div className="num">04</div>
                  <div className="name">🟡 Reflektion</div>
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
              <p className="section-title">Lektioner i {subject.label}</p>
              <div className="quick-prompts">
                {lessons.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className="quick-prompt"
                    onClick={() => {
                      welcome();
                      setTimeout(() => send(l.prompt), 100);
                    }}
                  >
                    {l.title} · {l.interest}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="grid-2" style={{ paddingTop: "1rem" }}>
            <aside>
              <div className="curiosity-bar-wrap" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="section-title" style={{ margin: 0 }}>Curiosity Engine</span>
                  <span className="gold" style={{ fontWeight: 700 }}>{curiosity} XP</span>
                </div>
                <div className="curiosity-track">
                  <div className="curiosity-fill" style={{ width: `${level.progressToNext}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                  <span className="gold">{level.name}</span>
                  <span className="muted">
                    {level.next ? `${level.next.min - curiosity} till nästa` : "Maxnivå"}
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

              <p className="section-title">Lektioner</p>
              <div className="quick-prompts" style={{ marginBottom: "1rem" }}>
                {lessons.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className="quick-prompt"
                    onClick={() => send(l.prompt)}
                    disabled={loading}
                  >
                    {l.title}
                  </button>
                ))}
              </div>

              <p className="section-title">Snabbfrågor</p>
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
          {source === "groq" ? "Driven av Groq · llama-3.3-70b" : "Demo-läge (lägg till GROQ_API_KEY för live-AI)"}
        </p>
      </footer>
    </div>
  );
}
