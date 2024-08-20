<H3 align="center"><strong>Frigade Demo</strong></H3>
<div align="center">
<a href="https://frigade.com">Website</a> 
<span> · </span>
<a href="https://demo.frigade.com">Demo</a> 
<span> · </span>
<a href="https://docs.frigade.com">Docs</a>
</div>


<br />

![Frigade iamge](https://cdn.frigade.com/0534ad31-8dc3-4061-9e53-53aae2ff3cf8.png)

[Frigade](<https://frigade.com>) is the modern product adoption platform. Frigade makes it easy to build better customer
journeys in your product through beautiful pre-built UI components, a flexible API and SDK, and an easy-to-use web
dashboard. It is
purpose-built for modern software teams that care about design, flexibility, and customization.

This repo contains the source code for [demo.frigade.com](https://demo.frigade.com).

## Getting Started

First, copy the sample environment file:

```bash
cp .env.sample .env.local
```
Then, install the dependencies:

```bash
pnpm install
```

Next, run the development server:

```bash
pnpm dev
```

Now, open [http://localhost:3000](http://localhost:3000) with your browser to see the demo.

## Using your own API key and Flows

If you wish to use your own API key, you can replace the `NEXT_PUBLIC_FRIGADE_API_KEY` in the `.env.local` file with your own API key. 
You will also need to update the Flow IDs found in [src/lib/flow-details.ts](src/lib/flow-details.ts) to match the Flow IDs in your Frigade account.

All the Flow configurations (i.e. YAML configs) are available in this as well file.
