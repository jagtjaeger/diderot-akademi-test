/**
 * Dideron – demo-svar med DILM-struktur (Konkret → Representationell → Abstrakt → Reflektion)
 * Fungerar utan API-nyckel så testappen alltid går att visa.
 */

export type DILMResponse = {
  concrete: string;
  representational: string;
  abstract: string;
  reflection: string;
  curiosityAwarded: number;
};

const DEMO_RESPONSES: Record<string, DILMResponse> = {
  default: {
    concrete:
      "Tänk dig att du står på en fotbollsplan. Du ska lägga en straff. Avståndet från straffpunkten till mållinjen är 11 meter. Du behöver veta hur långt bollen ska färdas – det är konkret matematik du redan använder utan att tänka på det.",
    representational:
      "Vi kan rita det som en rät linje från punkt A (straffpunkten) till punkt B (målet). Avståndet kallar vi d = 11 m. Om målvakten tar ett steg åt sidan blir det en rätvinklig triangel – då dyker Pythagoras upp: a² + b² = c².",
    abstract:
      "Generellt: i ett rätvinkligt koordinatsystem är det kortaste avståndet mellan två punkter hypotenusan. Formeln a² + b² = c² är en first principle – den gäller på planen, i en ritning och på Mars.",
    reflection:
      "När har du senast använt avstånd eller vinklar utan att kalla det matte? Hur skulle du förklara Pythagoras för en kompis som bara bryr sig om fotboll?",
    curiosityAwarded: 35,
  },
  procent: {
    concrete:
      "Ett lag har gjort 12 mål på 20 skott. Hur stor andel av skotten blev mål? Du jämför det som gick in med det totala – det är procent i vardagen.",
    representational:
      "Vi skriver det som ett bråk: 12/20. För att få procent multiplicerar vi med 100: (12/20) × 100 = 60 %. Bilden är en cirkel eller ett stapeldiagram där 60 % är ifyllt.",
    abstract:
      "Procent betyder 'per hundra'. Allmänt: andel = (del / helhet) × 100. Samma struktur används i statistik, ekonomi och sannolikhet.",
    reflection:
      "Hitta tre saker i din vecka där du redan tänker i procent (rea, batteri, matchstatistik). Vad blir lättare när du ser mönstret?",
    curiosityAwarded: 40,
  },
  evolution: {
    concrete:
      "Föreställ dig en flock fåglar på en ö. Vissa har lite längre näbb och når frön som andra inte når. De äter bättre, överlever oftare och får fler ungar – näbben 'vinner' utan att någon planerat det.",
    representational:
      "Vi kan rita det som ett träd: generation 1 → variation → selektion → generation 2 med fler långnäbbade. Det är en modell av naturligt urval.",
    abstract:
      "Evolution vilar på tre first principles: variation, ärftlighet och selektion. Tillsammans ger de anpassning över tid – utan målmedveten design.",
    reflection:
      "Var ser du 'selektion' i din egen värld – i sport, musik eller teknik? Vad skulle hända om variation försvann?",
    curiosityAwarded: 38,
  },
};

function pickResponse(message: string): DILMResponse {
  const m = message.toLowerCase();
  if (m.includes("procent") || m.includes("percent") || m.includes("andel")) {
    return DEMO_RESPONSES.procent;
  }
  if (m.includes("evolution") || m.includes("darwin") || m.includes("urval")) {
    return DEMO_RESPONSES.evolution;
  }
  if (
    m.includes("pythagoras") ||
    m.includes("straff") ||
    m.includes("fotboll") ||
    m.includes("triangel")
  ) {
    return DEMO_RESPONSES.default;
  }
  return DEMO_RESPONSES.default;
}

export function formatDILMMessage(r: DILMResponse): string {
  return [
    `🟢 KONKRET\n${r.concrete}`,
    `\n🔵 REPRESENTATIONELL\n${r.representational}`,
    `\n🟣 ABSTRAKT\n${r.abstract}`,
    `\n🟡 REFLEKTION\n${r.reflection}`,
    `\n✨ +${r.curiosityAwarded} Curiosity`,
  ].join("\n");
}

export async function askDideron(
  message: string,
  subjectLabel: string
): Promise<{ text: string; points: number }> {
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
  const response = pickResponse(message);
  const intro = `📜 Dideron · ${subjectLabel}\n\n`;
  return {
    text: intro + formatDILMMessage(response),
    points: response.curiosityAwarded,
  };
}
