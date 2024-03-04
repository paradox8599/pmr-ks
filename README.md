# Next.js & Keystone.js for Client Record Management

## Setup

`npm install`

## Environment Variables

create `.env` file for development:

```sh
KS_PORT=3000

# sqlite | mysql | postgresql
DB_PROVIDER="postgresql"
DATABASE_URL="postgresql://zcm:zcm@localhost:5432/zcm"

# Cloudflare R2 / AWS S3
AWS_BUCKET="zcm"
AWS_ENDPOINT_URL=""
AWS_CUSTOM_URL=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""

# using nextjs graphql route as server so no need to start a keystone server
NEXT_PUBLIC_SERVER_URL="http://localhost:4000"
NEXT_PUBLIC_GRAPHQL_PATH="/api/graphql"
```

## Start dev

- Next: `npm run dev:nx`
- Keystone: `npm run dev:ks`

## Notes

### Body Picture

Hardcoded in file `schema/views/kanvas.tsx`

### Data fetching

#### Server side

Use `keystoneContext`

> [(Only works with next 13, looking into move to next 14)](https://github.com/keystonejs/keystone/pull/8881)

```js
import { keystoneContext } from "@/keystone/context";
const userCount = await keystoneContext.query.User.count();
```

#### Client side

Use hook `useGraphql(query: string, variables: any = {})` for data fetching.

Check API explorer for query construction: `http://localhost:3000/api/graphql`

## Build

### Environment Variables

Before build, `npm run postinstall` is required for generating prisma db config.

### Database initialization

`npm run push`

## Deploy

### Deploy Keystone Admin UI

#### Deploy to <https://fly.io>

- Create app if not exists: `fly app create <app name>`
- Change build args & env in `fly.toml`
- Set secrets one by one: `fly secrets set <KEY>=<VALUE>`
- Set secrets by import: `fly secrets import`, or use `.env` with command `fly secrets import <<< $(cat .env | grep -E '^[^#w]')`
- Deploy `fly deploy`

#### Self Hosting

`docker compose build`

`docker compose up -d`

### Deploy Next.js

#### Deploy to <https://vercel.app>
