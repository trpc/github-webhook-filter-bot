# GitHub Webhooks without bots

Receive webhooks from GitHub and filter out bots.

## How it works

It takes a webhook payload and see if the `sender` includes `[bot]` and ignores it if it does

## How to use

1. Get a URI-encoded version of your webhook target
   1. Open web inspector
   2. Run `copy(encodeURIComponent('YOUR_URL_HERE'))`
1. Set Webhook target in GitHub as `https://github-webhook-filter-bot.trpc.io/api/?target=YOUR_RESULT_FROM_ABOVE`
