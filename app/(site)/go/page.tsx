import type { Metadata } from "next";
import GoClient from "./GoClient";

export const metadata: Metadata = {
  title: "@driftibo · Start here",
};

export default function Page() {
  return <GoClient />;
}
