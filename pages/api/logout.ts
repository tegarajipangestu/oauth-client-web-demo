import type { NextApiRequest, NextApiResponse } from 'next'

function parseCookie(str: string): Record<string, string> {
  return str.split(';').reduce((acc: Record<string, string>, part) => {
    const [key, ...v] = part.trim().split('=')
    if (!key) return acc
    acc[key] = decodeURIComponent(v.join('='))
    return acc
  }, {})
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {}
  let idToken: string | undefined
  if (cookies.tokens) {
    try {
      const t = JSON.parse(cookies.tokens)
      idToken = t.id_token
    } catch {}
  }
  res.setHeader('Set-Cookie', 'tokens=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  const state = Math.random().toString(36).substring(2)
  const logoutUrl = `${process.env.HYDRA_URL}/oauth2/sessions/logout?` +
    new URLSearchParams({
      post_logout_redirect_uri: process.env.HOST_URL || '',
      state,
      id_token_hint: idToken || ''
    }).toString()
  res.writeHead(302, { Location: logoutUrl })
  res.end()
}
