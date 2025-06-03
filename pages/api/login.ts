import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const state = Math.random().toString(36).substring(2)
  const redirectUri = `${process.env.HOST_URL}/api/callback`
  const authUrl = `${process.env.HYDRA_URL}/oauth2/auth?` +
    new URLSearchParams({
      client_id: process.env.CLIENT_ID || '',
      response_type: 'code',
      scope: 'openid offline',
      redirect_uri: redirectUri,
      state
    }).toString()
  res.writeHead(302, { Location: authUrl })
  res.end()
}
