# Node.js Gemini Agent with Function Calling

A working AI agent built with Google Gemini 1.5 Flash and Node.js. The agent can call real tools to answer questions — no paid external APIs required.

## Tools

| Tool | API | Cost |
|------|-----|------|
| `get_weather` | Open-Meteo | Free, no key |
| `calculate` | Pure JS | Free |
| `get_exchange_rate` | frankfurter.app | Free, no key |

## Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/ziaongit/nodejs-gemini-agent
cd nodejs-gemini-agent
npm install
```

2. Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

Get a free key at [aistudio.google.com](https://aistudio.google.com) — 1,500 requests/day, no credit card.

3. Run the agent:

```bash
npm start
```

## Example queries

```
What's the weather in Tokyo?
What is the weather in Berlin and convert 500 EUR to USD?
How much is 18% tip on a $47.50 bill?
If I have 1000 USD, how many Japanese Yen can I get?
```

## Article

This repo is the companion code for the freeCodeCamp article:
[How to Build an AI Agent with Function Calling in Node.js Using Google Gemini](https://www.freecodecamp.org/news)

## License

MIT
