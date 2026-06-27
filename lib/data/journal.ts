export type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "q"; text: string };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  kind: string;
  read: string;
  photo: string;
  scene: string;
  body: BodyBlock[];
};

export const articles: Article[] = [
  {
    slug: "switzerland-twins",
    kind: "Guide",
    read: "6 min",
    photo: "Chopta ridge · ref ✓",
    scene: "s-chopta",
    title: "9 places in India that look like Switzerland",
    dek: "And cost a tenth. A field-tested list, season by season.",
    body: [
      {
        type: "p",
        text: "Everyone has the same saved folder: a green valley, a wooden chalet, a lake so still it doubles the sky. Almost none of them book the flight. It feels far, dear, and complicated.",
      },
      {
        type: "p",
        text: "It usually is not. The same picture — pine ridges, alpine meadows, snow lines — repeats across India for a fraction of the cost and none of the visa.",
      },
      { type: "h", text: "Start with Chopta" },
      {
        type: "p",
        text: "A deodar ridge under Tungnath, the highest Shiva temple on earth. A Chandrashila sunrise lines up four Himalayan giants. People call it mini-Switzerland and, for once, the nickname earns its keep.",
      },
      { type: "q", text: "Same soul. A fraction of the price. Bookable now." },
      { type: "h", text: "Then go further" },
      {
        type: "p",
        text: "Spiti for the cold-desert greys of Iceland. Ziro for terraces that rival Bali. Dzükou for New Zealand greens. Gokarna for a quieter coast than the one everyone posts.",
      },
      {
        type: "p",
        text: "The trick is not the place. It is letting something else choose it, before the research kills the trip.",
      },
    ],
  },
  {
    slug: "why-we-stopped",
    kind: "Essay",
    read: "4 min",
    photo: "Forty open tabs",
    scene: "s-spiti",
    title: "Why we stopped letting people choose",
    dek: "On the tyranny of 40 open tabs.",
    body: [
      {
        type: "p",
        text: "Everyone we talked to wanted to travel more and planned less than they meant to. Not for lack of options — for too many. The trip dies in the research.",
      },
      {
        type: "q",
        text: "So we built a star that decides, and a promise that what it picks is real.",
      },
      {
        type: "p",
        text: "Tell it your limits. It sends you somewhere true — anchored to a real reference photo, no phantom places. You stop choosing. You just go.",
      },
      {
        type: "p",
        text: "It turns out the freedom people wanted was not more choice. It was permission to stop.",
      },
    ],
  },
  {
    slug: "how-we-make-images",
    kind: "Honest",
    read: "3 min",
    photo: "Reference + render",
    scene: "s-gokarna",
    title: "How we make our images (and why we anchor them)",
    dek: "Generated images, real places — declared up front.",
    body: [
      {
        type: "p",
        text: "Every location image on Driftibo is AI-generated. We say that plainly, because the alternative — pretending — is how phantom destinations end up in brochures.",
      },
      { type: "h", text: "The anchor rule" },
      {
        type: "p",
        text: "A place only enters the spin pool once a real reference photo of that exact spot exists and the render is approved against it. Generated, yes. Invented, never.",
      },
      { type: "q", text: "No phantom destinations. Ever." },
      {
        type: "p",
        text: "If the render drifts from the real place, it does not ship. That is the whole rule, and we are happy to be boring about it.",
      },
    ],
  },
];
