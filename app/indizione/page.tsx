import type { Metadata } from "next";
import IndizioneClient from "./IndizioneClient";

export const metadata: Metadata = {
  title: "Calcolatore Indizione Bizantina | Castrimaris",
  description:
    "Calcola l'Indizione Bizantina e Greco-Bizantina (Regno di Napoli) per qualsiasi data storica. Strumento per la ricerca archivistica e diplomatica medievale.",
};

export default function Page() {
  return <IndizioneClient />;
}
