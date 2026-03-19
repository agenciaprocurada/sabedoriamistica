export interface DreamSymbol {
  nome: string;
  significado: string;
}

export interface DreamAnalysis {
  resumo: string;
  simbolos: DreamSymbol[];
  interpretacao_emocional: string;
  arquetipos: string[];
  mensagem_inconsciente: string;
  orientacao_pratica: string;
  reflexao: string;
}

export function parseAnalysis(raw: string | null): DreamAnalysis | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DreamAnalysis;
  } catch {
    return null;
  }
}
