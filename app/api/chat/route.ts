import { requireAuth } from "@/app/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `당신은 전문 여행 플래너입니다. 사용자가 여행 계획을 세울 수 있도록 친절하고 구체적으로 도와주세요.

다음을 고려하여 맞춤형 여행 계획을 제안하세요:
- 목적지의 주요 명소, 현지 맛집, 숙소 추천
- 날짜별 세부 일정 (오전/오후/저녁)
- 이동 방법과 예상 비용
- 여행 팁과 주의사항

응답은 한국어로 작성하고, 필요할 때 마크다운 형식(목록, 강조 등)을 활용해 가독성을 높여주세요.`;

export async function POST(req: Request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages required", { status: 400 });
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
