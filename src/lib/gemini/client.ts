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
  let systemPrompt =
    type === "free"
      ? loadPrompt("sonhos-basico.md")
      : loadPrompt("sonhos-pago.md");

  if (type === "paid") {
    systemPrompt = systemPrompt
      .replace("{dream_description}", description)
      .replace("{free_analysis}", freeAnalysis ?? "(não disponível)");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.9,
    },
  });

  const userPrompt = type === "paid"
    ? `Gere a análise completa para o sonho descrito acima.`
    : `Analise este sonho:\n\n"${description}"`;

  const result = await model.generateContent(userPrompt);

  return result.response.text();
}
