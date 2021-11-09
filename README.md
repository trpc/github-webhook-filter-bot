# GitHub webhooks without bots

Receives webhooks from GitHub and filter out bots, then proxies it to your target.

## How it works

It takes a webhook payload, checks if the `sender` includes `[bot]`, and ignores it if it does.

## How to use

1. Open web inspector
2. Run `copy('https://github-webhook-filter-bot.trpc.io/api/?target=' + encodeURIComponent('YOUR_URL_HERE'))`
3. Paste the URL from your clipboard into GitHub
