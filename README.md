# OAuth Client Web Demo

This demo is a simple Next.js relying party for an [Ory Hydra](https://github.com/ory/hydra) OAuth2/OpenID Connect provider.

## Features

- Shows a logged out state with application name and OAuth client ID.
- Performs the Authorization Code flow with `openid offline` scopes.
- Exchanges the authorization code for `access_token`, `id_token` and `refresh_token`.
- Uses the Hydra introspection endpoint to validate the access token and shows the decoded result.
- Supports logout using the OIDC logout endpoint.

## Configuration

Create an `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Set the following variables:

- `APP_NAME` – Human readable application name
- `CLIENT_ID` – OAuth2 client id
- `CLIENT_SECRET` – OAuth2 client secret
- `HOST_URL` – Public URL of this application (e.g. `http://localhost:3000`)
- `HYDRA_URL` – URL to the Hydra server (e.g. `http://localhost:4444`)
- `PORT` – Port to run the Next.js server (defaults to `3000`)

## Running locally

Install dependencies and start the Next.js development server:

```bash
npm install
npm run dev
```

The application will be available at `HOST_URL`.

## Notes

The application requires a running Ory Hydra instance with a client configured for the above `CLIENT_ID` and `CLIENT_SECRET`.
