import { GetServerSideProps } from 'next'
import Link from 'next/link'

interface Tokens {
  access_token: string
  id_token?: string
  refresh_token?: string
  [key: string]: any
}

interface Props {
  tokens: Tokens | null
  introspection: any
  config: { appName: string; clientId: string }
}

function parseCookie(str: string): Record<string, string> {
  return str.split(';').reduce((acc: Record<string, string>, part) => {
    const [key, ...v] = part.trim().split('=')
    if (!key) return acc
    acc[key] = decodeURIComponent(v.join('='))
    return acc
  }, {})
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {}
  let tokens: Tokens | null = null
  let introspection: any = null
  if (cookies.tokens) {
    try {
      tokens = JSON.parse(cookies.tokens)
    } catch {}
  }
  if (tokens?.access_token && process.env.HYDRA_URL) {
    try {
      const res = await fetch(`${process.env.HYDRA_URL}/oauth2/introspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({ token: tokens.access_token }).toString()
      })
      introspection = await res.json()
    } catch (err: any) {
      introspection = { error: err.message }
    }
  }
  return {
    props: {
      tokens,
      introspection,
      config: { appName: process.env.APP_NAME || 'App', clientId: process.env.CLIENT_ID || '' }
    }
  }
}

export default function Home({ tokens, introspection, config }: Props) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>{config.appName}</h1>
      <p>Client ID: {config.clientId}</p>
      {!tokens && (
        <Link href="/api/login"><button>Login</button></Link>
      )}
      {tokens && (
        <div>
          <h2>Logged In</h2>
          <pre>Access Token: {tokens.access_token}</pre>
          {tokens.id_token && <pre>ID Token: {tokens.id_token}</pre>}
          {tokens.refresh_token && <pre>Refresh Token: {tokens.refresh_token}</pre>}
          <h3>Token Introspection</h3>
          <pre>{JSON.stringify(introspection, null, 2)}</pre>
          <Link href="/api/logout"><button>Logout</button></Link>
        </div>
      )}
    </div>
  )
}
