# Next.js & Keystone.js for Client Record Management

## Setup

`npm install`

## Start dev

- Next: `npm run dev:nx`
- Keystone: `npm run dev:ks`

## Notes

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

Before `npm run build:nx`, `source .env && npm run postinstall` is required for generating prisma db config.

### Database initialization

`npm run push`

## Deploy

### Deploy Keystone Admin UI

#### Deploy to <https://fly.io>

- Create app if not created: `fly app create <app name>`
- Change build args & env in `fly.toml`
- Set secrets: `fly secrets set <KEY>=<VALUE>`
- Deploy `fly deploy`

#### Self Hosting

`docker compose build`

`docker compose up -d`

### Deploy Next.js

#### Deploy to <https://vercel.app>
