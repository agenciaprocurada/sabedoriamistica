import { horoscopoData, type Signo } from "@/data/horoscopo";

/**
 * Retorna o índice (0–4) da frase do dia para um signo+categoria.
 * A semente combina data + signo + categoria para que cada par tenha
 * uma frase diferente no mesmo dia, mas todos os usuários vejam a mesma.
 */
function getDailyIndex(date: Date, sign: string, category: string): number {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Hash simples de sign+category para diversificar os índices
  const str = sign + category;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 97;
  }

  return (day + month + year + hash) % 5;
}

export interface HoroscopoDiario {
  amor: string;
  trabalho: string;
  energia: string;
}

export function getHoroscopoDiario(signo: Signo, date: Date = new Date()): HoroscopoDiario {
  const data = horoscopoData[signo];
  return {
    amor:     data.amor[getDailyIndex(date, signo, "amor")],
    trabalho: data.trabalho[getDailyIndex(date, signo, "trabalho")],
    energia:  data.energia[getDailyIndex(date, signo, "energia")],
  };
}
