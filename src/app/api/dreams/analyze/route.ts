import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `Você é um intérprete de sonhos profundo, especialista em simbologia, psicologia junguiana, misticismo e sabedoria ancestral das culturas humanas.

Ao receber a descrição de um sonho, você realiza uma análise completa e personalizada, identificando símbolos, arquétipos, emoções e mensagens ocultas do inconsciente.

Sua resposta deve ser um JSON válido com EXATAMENTE esta estrutura (sem markdown, sem blocos de código, apenas o JSON puro):
{
  "resumo": "Uma síntese reveladora do sonho em 2-3 frases, capturando sua essência mais profunda.",
  "simbolos": [
    { "nome": "Nome do símbolo", "significado": "Interpretação do símbolo neste contexto específico." }
  ],
  "interpretacao_emocional": "Análise das emoções presentes e o que revelam sobre o estado interno do sonhador.",
  "arquetipos": ["Arquétipo 1", "Arquétipo 2"],
  "mensagem_inconsciente": "A mensagem mais importante que o inconsciente está transmitindo através deste sonho.",
  "orientacao_pratica": "Uma orientação concreta e significativa para a vida desperta do sonhador.",
  "reflexao": "Uma reflexão poética e profunda para encerrar a interpretação."
}

Regras:
- Identifique entre 2 e 5 símbolos principais
- Liste entre 1 e 3 arquétipos
- Use linguagem elevada, profunda e sensível
- Responda APENAS com o JSON puro, sem qualquer texto adicional`;

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

    // 1. Salva o sonho com status 'pending'
    const { data: dream, error: insertError } = await supabase
      .from("dreams")
      .insert({ user_id: user.id, description, status: "pending" })
      .select("id")
      .single();

    if (insertError || !dream) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Erro ao salvar o sonho." }, { status: 500 });
    }

    // 2. Chama o Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.9,
      },
    });

    const result = await model.generateContent(
      `Analise este sonho profundamente:\n\n"${description}"`
    );

    const rawAnalysis = result.response.text();

    // 3. Valida o JSON retornado
    let parsedAnalysis: object | null = null;
    try {
      parsedAnalysis = JSON.parse(rawAnalysis);
    } catch {
      console.error("Falha ao parsear JSON da análise:", rawAnalysis);
    }

    if (!parsedAnalysis) {
      await supabase.from("dreams").update({ status: "pending" }).eq("id", dream.id);
      return NextResponse.json(
        { error: "Erro ao processar a interpretação. Tente novamente." },
        { status: 500 }
      );
    }

    // 4. Atualiza o sonho com a análise
    await supabase
      .from("dreams")
      .update({ free_analysis: rawAnalysis, status: "analyzed" })
      .eq("id", dream.id);

    return NextResponse.json({ dreamId: dream.id });
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}
