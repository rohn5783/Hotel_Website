export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).end();
  }

  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  if (!url || !anonKey || !url.startsWith('https://')) {
    return response.status(500).json({ error: 'Supabase configuration is missing or invalid.' });
  }

  response.setHeader('Cache-Control', 'public, max-age=300');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  return response.status(200).json({ url, anonKey });
}
