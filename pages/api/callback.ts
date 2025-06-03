import type { NextApiRequest, NextApiResponse } from 'next'

function buildBasicAuth(id?: string, secret?: string) {
  return 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query
  if (!code || Array.isArray(code)) {
    res.status(400).send('missing code')
    return
  }
  try {
    const tokenRes = await fetch(`${process.env.HYDRA_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': buildBasicAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.HOST_URL}/api/callback`
      }).toString()
    })
    const tokens = await tokenRes.json()
    res.setHeader('Set-Cookie', `tokens=${encodeURIComponent(JSON.stringify(tokens))}; Path=/; HttpOnly`)
    res.writeHead(302, { Location: '/' })
    res.end()
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
