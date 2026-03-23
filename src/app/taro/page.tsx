import type { Metadata } from "next";
import { TaroGame } from "./TaroGame";

export const metadata: Metadata = {
  title: "Jogo de Tarô Online | Sabedoria Mística",
  description: "Consulte os 22 Arcanos Maiores do Tarô. Escolha suas cartas e descubra as mensagens do passado, presente e futuro. Gratuito e sem cadastro.",
};

export default function TaroPage() {
  return <TaroGame />;
}
