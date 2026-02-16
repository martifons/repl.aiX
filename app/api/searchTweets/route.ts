// app/api/searchTweets/route.ts
import { NextResponse } from 'next/server';

interface Tweet {
  id: number;
  author: string;
  content: string;
  authorId: string;
  publicMetrics: {
    retweets: number;
    likes: number;
    replies: number;
  };
}

export async function GET(req: Request) {
  try {
    // Puedes leer query params si quieres filtrar por búsqueda
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    // Datos fake para simular tweets
    const fakeTweets: Tweet[] = [
      {
        id: 1,
        author: 'Juan',
        authorId: '101',
        content: query
          ? `Simulando tweet con la búsqueda: "${query}"`
          : '¿Alguien conoce herramientas SaaS útiles?',
        publicMetrics: { retweets: 2, likes: 5, replies: 3 },
      },
      {
        id: 2,
        author: 'Ana',
        authorId: '102',
        content: 'Estoy probando un nuevo método para crecer en X.',
        publicMetrics: { retweets: 1, likes: 3, replies: 2 },
      },
      {
        id: 3,
        author: 'Carlos',
        authorId: '103',
        content: 'Tips para indie hackers que empiezan.',
        publicMetrics: { retweets: 3, likes: 4, replies: 1 },
      },
    ];

    return NextResponse.json({ tweets: fakeTweets });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching tweets' }, { status: 500 });
  }
}
