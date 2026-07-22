export type Subject = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  prompts: string[];
};

export const SUBJECTS: Subject[] = [
  {
    id: "matte",
    emoji: "📐",
    label: "Matematik",
    color: "#d4af37",
    prompts: [
      "Förklara procent med fotboll",
      "Pythagoras på en straffyta",
      "Vad är en funktion – som en matchplan?",
    ],
  },
  {
    id: "fysik",
    emoji: "⚛️",
    label: "Fysik",
    color: "#4a7ab8",
    prompts: [
      "Kraft och rörelse i en frispark",
      "Energi i en cykeltur",
      "Varför studsar en boll?",
    ],
  },
  {
    id: "biologi",
    emoji: "🧬",
    label: "Biologi",
    color: "#3d9a6a",
    prompts: [
      "Evolution på 3 minuter",
      "Hur fungerar fotosyntes?",
      "Immunförsvaret som ett lag",
    ],
  },
  {
    id: "kemi",
    emoji: "🧪",
    label: "Kemi",
    color: "#c97b4a",
    prompts: [
      "Atomer som byggklossar",
      "Varför rostas bröd?",
      "Syror och baser i köket",
    ],
  },
  {
    id: "historia",
    emoji: "📜",
    label: "Historia",
    color: "#a67c52",
    prompts: [
      "Upplysningen och Diderot",
      "Varför föll Rom?",
      "Industriella revolutionen",
    ],
  },
  {
    id: "samhalle",
    emoji: "🏛️",
    label: "Samhällskunskap",
    color: "#6b8cae",
    prompts: [
      "Vad är demokrati?",
      "Medier och källkritik",
      "Hållbar utveckling",
    ],
  },
  {
    id: "engelska",
    emoji: "🇬🇧",
    label: "Engelska",
    color: "#5a7a9a",
    prompts: [
      "Describe your hobby in English",
      "Past tense with football",
      "Write a short dialogue",
    ],
  },
  {
    id: "geografi",
    emoji: "🌍",
    label: "Geografi",
    color: "#4a9a7a",
    prompts: [
      "Klimatzoner enkelt",
      "Varför finns öknar?",
      "Sveriges landskap",
    ],
  },
];

export function getSubject(id: string): Subject {
  return SUBJECTS.find((s) => s.id === id) || SUBJECTS[0];
}
