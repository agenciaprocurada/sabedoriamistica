import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

function loadPrompt(filename: string): string {
  return readFileSync(
    join(process.cwd(), "prompts", "sonhos", filename),
    "utf-8"
  ).trim();
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const description: string = (body.description ?? "").trim();

    if (!description || description.length < 20) {
      return NextResponse.json(
        { error: "Descreva seu sonho com pelo menos 20 caracteres." },
        { status: 400 }
      );
    }

    // 1. Salva o sonho
    const { data: dream, error: insertError } = await supabase
      .from("dreams")
      .insert({ user_id: user.id, description, status: "pending" })
      .select("id")
      .single();

    if (insertError || !dream) {
      console.error("Erro ao salvar sonho:", insertError);
      return NextResponse.json(
        { error: "Não foi possível salvar seu sonho. Tente novamente." },
        { status: 500 }
      );
    }

    // 2. Chama Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY não configurada");
      return NextResponse.json(
        { error: "Serviço de interpretação indisponível." },
        { status: 500 }
      );
    }

    const promptFree = loadPrompt("sonhos-basico.md");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: promptFree,
      generationConfig: { temperature: 0.9 },
    });

    let freeAnalysis: string;
    try {
      const result = await model.generateContent(
        `Analise este sonho:\n\n"${description}"`
      );
      freeAnalysis = result.response.text();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Erro Gemini:", msg);
      await supabase.from("dreams").update({ status: "error" }).eq("id", dream.id);
      return NextResponse.json(
        { error: `Erro ao interpretar: ${msg}` },
        { status: 500 }
      );
    }

    // 3. Atualiza com a análise
    await supabase
      .from("dreams")
      .update({ free_analysis: freeAnalysis, status: "analyzed" })
      .eq("id", dream.id);

    return NextResponse.json({ dreamId: dream.id, freeAnalysis });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Route error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
