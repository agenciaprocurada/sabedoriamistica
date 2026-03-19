import "server-only";
import { readFileSync } from "fs";
import { join } from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function loadPrompt(filename: string): string {
  return readFileSync(
    join(process.cwd(), "prompts", "sonhos", filename),
    "utf-8"
  ).trim();
}

export async function generateDreamAnalysis(
  description: string,
  type: "free" | "paid",
  freeAnalysis?: string
): Promise<string> {
  const systemPrompt =
    type === "free"
      ? loadPrompt("sonhos-basico.md")
      : loadPrompt("sonhos-pago.md");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.9,
    },
  });

  let userPrompt = `Analise este sonho:\n\n"${description}"`;

  if (type === "paid" && freeAnalysis) {
    userPrompt += `\n\nAbaixo está a interpretação gratuita que já foi entregue ao usuário. Sua análise completa deve aprofundar, expandir e continuar a partir dela — não repita o que já foi dito:\n\n---\n${freeAnalysis}\n---`;
  }

  const result = await model.generateContent(userPrompt);

  return result.response.text();
}
