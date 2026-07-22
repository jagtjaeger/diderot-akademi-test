/**
 * Dideron – anropar /api/chat (Groq) om möjligt, annars lokala DILM-demo-svar.
 */

export type DILMResponse = {
  concrete: string;
  representational: string;
  abstract: string;
  reflection: string;
  curiosityAwarded: number;
};

const DEMO: Record<string, DILMResponse> = {
  default: {
    concrete:
      "Tänk dig att du står på en fotbollsplan. Du ska lägga en straff. Avståndet från straffpunkten till mållinjen är 11 meter – konkret matematik du redan använder.",
    representational:
      "Rita en linje från A (straffpunkt) till B (mål). Om målvakten tar ett steg åt sidan får du en rätvinklig triangel: a² + b² = c².",
    abstract:
      "I ett rätvinkligt system är det kortaste avståndet hypotenusan. a² + b² = c² är en first principle – giltig på planen och på Mars.",
    reflection:
      "När använde du avstånd eller vinklar utan att kalla det matte? Hur förklarar du Pythagoras för en kompis som bara bryr sig om fotboll?",
    curiosityAwarded: 35,
  },
  procent: {
    concrete:
      "Ett lag har 12 mål på 20 skott. Hur stor andel blev mål? Du jämför det som gick in med det totala – procent i vardagen.",
    representational:
      "Bråket 12/20 × 100 = 60 %. Rita en cirkel eller stapel där 60 % är ifyllt.",
    abstract:
      "Procent = per hundra. Allmänt: andel = (del / helhet) × 100. Samma struktur i statistik, ekonomi och sannolikhet.",
    reflection:
      "Hitta tre saker i din vecka där du redan tänker i procent (rea, batteri, matchstatistik).",
    curiosityAwarded: 40,
  },
  evolution: {
    concrete:
      "En flock fåglar på en ö: några har längre näbb och når mer mat. De överlever oftare och får fler ungar – utan att någon planerat det.",
    representational:
      "Rita ett träd: generation 1 → variation → selektion → generation 2 med fler långnäbbade.",
    abstract:
      "Evolution vilar på variation, ärftlighet och selektion. Tillsammans ger de anpassning över tid.",
    reflection:
      "Var ser du selektion i sport, musik eller teknik? Vad händer om variation försvinner?",
    curiosityAwarded: 38,
  },
  energi: {
    concrete:
      "När du cyklar uppför känns det tungt. Uppe på toppen har du 'sparat' energi. Nedför går det av sig självt – energin byter form.",
    representational:
      "Lägesenergi högt uppe blir rörelseenergi nedför. Rita en backe med pilar: mgh → ½mv².",
    abstract:
      "Energi kan inte skapas eller förstöras, bara omvandlas. Det är energiprincipen.",
    reflection:
      "Var tar energin vägen när du bromsar? Hur märker du energiprincipen i din vardag?",
    curiosityAwarded: 36,
  },
};

function pickDemo(message: string): DILMResponse {
  const m = message.toLowerCase();
  if (m.includes("procent") || m.includes("andel") || m.includes("skott")) return DEMO.procent;
  if (m.includes("evolution") || m.includes("näbb") || m.includes("urval")) return DEMO.evolution;
  if (m.includes("energi") || m.includes("cykel") || m.includes("backe")) return DEMO.energi;
  return DEMO.default;
}

function formatDemo(r: DILMResponse, subject: string): string {
  return [
    `📜 Dideron · ${subject} · demo`,
    ``,
    `🟢 KONKRET`,
    r.concrete,
    ``,
    `🔵 REPRESENTATIONELL`,
    r.representational,
    ``,
    `🟣 ABSTRAKT`,
    r.abstract,
    ``,
    `🟡 REFLEKTION`,
    r.reflection,
    ``,
    `✨ +${r.curiosityAwarded} Curiosity`,
  ].join("\n");
}

export async function askDideron(
  message: string,
  subjectLabel: string,
  history: { role: string; content: string }[] = []
): Promise<{ text: string; points: number; source: string }> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        subject: subjectLabel,
        history,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return {
          text: data.text.startsWith("📜") ? data.text : `📜 Dideron · ${subjectLabel}\n\n${data.text}`,
          points: data.points || 30,
          source: data.source || "groq",
        };
      }
    }
  } catch {
    // fall through to demo
  }

  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
  const demo = pickDemo(message);
  return {
    text: formatDemo(demo, subjectLabel),
    points: demo.curiosityAwarded,
    source: "demo",
  };
}
