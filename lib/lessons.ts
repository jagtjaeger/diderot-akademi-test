/** Färdiga minilektioner per ämne – används som snabbstart och demo-innehåll */

export type Lesson = {
  id: string;
  subjectId: string;
  title: string;
  interest: string;
  prompt: string;
};

export const LESSONS: Lesson[] = [
  // Matematik
  { id: "m1", subjectId: "matte", title: "Procent i matchen", interest: "fotboll", prompt: "Förklara procent med fotboll: 12 mål på 20 skott" },
  { id: "m2", subjectId: "matte", title: "Pythagoras på straffytan", interest: "fotboll", prompt: "Pythagoras på en straffyta – hur långt är det till hörnet?" },
  { id: "m3", subjectId: "matte", title: "Linjära samband", interest: "musik", prompt: "Förklara räta linjens ekvation med hur volymen ökar på en blandare" },
  { id: "m4", subjectId: "matte", title: "Negativa tal", interest: "temperatur", prompt: "Förklara negativa tal med temperatur under noll och bankkonto" },
  { id: "m5", subjectId: "matte", title: "Area och omkrets", interest: "gaming", prompt: "Beräkna area av en rektangulär spelplan i ett spel – konkret till formel" },
  // Fysik
  { id: "f1", subjectId: "fysik", title: "Frisparkens bana", interest: "fotboll", prompt: "Kraft och rörelse i en frispark – varför kurvar bollen?" },
  { id: "f2", subjectId: "fysik", title: "Energi i cykeln", interest: "cykel", prompt: "Lägesenergi och rörelseenergi när du cyklar uppför och nedför" },
  { id: "f3", subjectId: "fysik", title: "Ljud och musik", interest: "musik", prompt: "Hur fungerar ljudvågor – förklara frekvens med en gitarrsträng" },
  // Biologi
  { id: "b1", subjectId: "biologi", title: "Evolution snabbt", interest: "natur", prompt: "Evolution på 3 minuter med fågelnäbbar som exempel" },
  { id: "b2", subjectId: "biologi", title: "Fotosyntes", interest: "trädgård", prompt: "Hur fungerar fotosyntes – som en fabrik i bladet" },
  { id: "b3", subjectId: "biologi", title: "Immunförsvaret", interest: "sport", prompt: "Immunförsvaret som ett lag som försvarar kroppen" },
  // Kemi
  { id: "k1", subjectId: "kemi", title: "Atomer", interest: "bygg", prompt: "Atomer som byggklossar – periodiska systemet enkelt" },
  { id: "k2", subjectId: "kemi", title: "Kemiska reaktioner", interest: "matlagning", prompt: "Varför rostas bröd? Förklara kemisk reaktion i köket" },
  // Historia
  { id: "h1", subjectId: "historia", title: "Upplysningen", interest: "idéer", prompt: "Upplysningen och Diderot – varför var Encyclopédien viktig?" },
  { id: "h2", subjectId: "historia", title: "Industriella revolutionen", interest: "teknik", prompt: "Industriella revolutionen – hur förändrades människors vardag?" },
  // Samhälle
  { id: "s1", subjectId: "samhalle", title: "Demokrati", interest: "rättvisa", prompt: "Vad är demokrati? Ge konkreta exempel från elevens liv" },
  { id: "s2", subjectId: "samhalle", title: "Källkritik", interest: "sociala medier", prompt: "Medier och källkritik – hur bedömer man en nyhet på TikTok?" },
  // Engelska
  { id: "e1", subjectId: "engelska", title: "Hobby dialogue", interest: "football", prompt: "Write a short English dialogue about playing football with a friend" },
  // Geografi
  { id: "g1", subjectId: "geografi", title: "Klimatzoner", interest: "resa", prompt: "Klimatzoner enkelt – varför är det varmt vid ekvatorn?" },
];

export function lessonsForSubject(subjectId: string): Lesson[] {
  return LESSONS.filter((l) => l.subjectId === subjectId);
}
