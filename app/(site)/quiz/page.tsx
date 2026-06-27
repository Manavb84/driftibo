import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Good-Life Vibe Quiz · Driftibo",
  description:
    "Five questions. No right answers — only taste. We read the pattern and name the kind of drifter you are.",
};

export default function QuizPage() {
  return <QuizClient />;
}
