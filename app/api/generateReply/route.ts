import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content = body.content ?? body.tweet ?? "";

    if (!content) {
      return NextResponse.json({ reply: "Error: tweet vacío" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',   // modelo barato para MVP
      messages: [
        { role: 'system', content: 'Eres un asistente que genera respuestas cortas y útiles a tweets.' },
        { role: 'user', content: content }
      ],
      max_tokens: 60
    });

    const reply = completion.choices[0].message?.content || 'Error generando respuesta';

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ reply: 'Error generando respuesta' }, { status: 500 });
  }
}
