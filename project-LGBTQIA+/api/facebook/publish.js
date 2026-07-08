const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'fernandomariodasmartins@gmail.com';

async function publishToGraph({ graphVersion, targetId, pageAccessToken, message, link }) {
  const body = new URLSearchParams({
    message,
    link,
    access_token: pageAccessToken,
  });

  const graphResponse = await fetch(`https://graph.facebook.com/${graphVersion}/${targetId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const result = await graphResponse.json();
  return { ok: graphResponse.ok, status: graphResponse.status, result };
}

async function verifyFirebaseUser(idToken) {
  const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!firebaseApiKey) {
    throw new Error('VITE_FIREBASE_API_KEY nao configurada no servidor.');
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.users?.[0] || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo nao permitido.' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) {
      return res.status(401).json({ error: 'Login admin obrigatorio.' });
    }

    const firebaseUser = await verifyFirebaseUser(idToken);
    if (firebaseUser?.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Usuario sem permissao para publicar no Facebook.' });
    }

    const pageId = process.env.META_FACEBOOK_PAGE_ID;
    const pageAccessToken = process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!pageId || !pageAccessToken) {
      return res.status(500).json({
        error: 'Configure META_FACEBOOK_PAGE_ID e META_FACEBOOK_PAGE_ACCESS_TOKEN na Vercel.',
      });
    }

    const { message, link } = req.body || {};
    if (!message || !link) {
      return res.status(400).json({ error: 'Mensagem e link sao obrigatorios.' });
    }

    const graphVersion = process.env.META_GRAPH_VERSION || 'v20.0';
    const publishPayload = {
      graphVersion,
      targetId: pageId,
      pageAccessToken,
      message,
      link,
    };

    let publishResult = await publishToGraph(publishPayload);
    const metaError = publishResult.result?.error;
    const shouldRetryWithMe =
      metaError?.code === 100 &&
      typeof metaError.message === 'string' &&
      metaError.message.includes('global id');

    if (!publishResult.ok && shouldRetryWithMe) {
      publishResult = await publishToGraph({ ...publishPayload, targetId: 'me' });
    }

    if (!publishResult.ok) {
      const errorMessage = publishResult.result?.error?.message || 'Falha ao publicar no Facebook.';
      return res.status(publishResult.status).json({
        error:
          errorMessage +
          ' Verifique se META_FACEBOOK_PAGE_ACCESS_TOKEN e um Page Access Token com pages_manage_posts.',
      });
    }

    return res.status(200).json({
      id: publishResult.result.id,
      message: 'Publicado na pagina do Facebook.',
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro inesperado ao publicar no Facebook.',
    });
  }
}
