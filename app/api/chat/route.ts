import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = "nodejs";

const SYSTEM = `Du är Dideron, AI-tutor i Diderot Akademi (DILA).
Svara ALLTID på svenska i exakt denna struktur (använd emoji-rubrikerna):

🟢 KONKRET
[Elevens intresse/vardag – max 3–4 meningar]

🔵 REPRESENTATIONELL
[Bild, modell, analogi eller formel i vardagsspråk]

🟣 ABSTRAKT
[First principle / allmän regel]

🟡 REFLEKTION
[1–2 frågor som tränar metakognition]

Avsluta med en rad: ✨ +NN Curiosity (NN mellan 25 och 45).
Var varm, tydlig och pedagogisk. Anpassa till elevens intresse om det nämns.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const subject = String(body.subject || "Matematik");
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const key = process.env.GROQ_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "GROQ_API_KEY saknas", fallback: true },
        { status: 503 }
      );
    }

    const groq = new Groq({ apiKey: key });
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: SYSTEM + `\nAktivt ämne: ${subject}.` },
    ];

    for (const h of history.slice(-8)) {
      if (h?.role === "user" || h?.role === "assistant") {
        messages.push({ role: h.role, content: String(h.content || "") });
      }
    }
    messages.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.72,
      max_tokens: 1200,
    });

    const text =
      completion.choices[0]?.message?.content?.trim() ||
      "Jag kunde inte generera svar just nu.";

    const match = text.match(/\+(\d+)\s*Curiosity/i);
    const points = match ? Math.min(45, Math.max(20, parseInt(match[1], 10))) : 30;

    return NextResponse.json({ text, points, source: "groq" });
  } catch (err: unknown) {
    console.error("chat route error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg, fallback: true }, { status: 500 });
  }
}
