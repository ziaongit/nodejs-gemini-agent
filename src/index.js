// src/index.js
// CLI entry point. Reads user input line by line and passes each message to the agent.

require('dotenv').config();
const readline     = require('readline');
const { runAgent } = require('./agent');

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
});

function ask(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.log('Gemini Agent — type your question, or "exit" to quit\n');

  while (true) {
    const input = await ask('You: ');
    if (input.toLowerCase() === 'exit') break;
    if (!input.trim()) continue;

    try {
      const answer = await runAgent(input);
      console.log(`\nAgent: ${answer}\n`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }

  rl.close();
}

main();
