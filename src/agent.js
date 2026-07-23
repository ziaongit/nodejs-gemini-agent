// src/agent.js
// The agentic loop. Sends the user message to Gemini, handles function calls
// using Promise.allSettled for parallel execution, and loops until the model
// returns a plain text answer.

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { toolDefinitions }    = require('./tools');
const { get_weather, calculate, get_exchange_rate } = require('./functions');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Map tool names to handler functions
const toolHandlers = { get_weather, calculate, get_exchange_rate };

async function runAgent(userMessage) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools: [{ functionDeclarations: toolDefinitions }],
  });

  const chat = model.startChat();

  console.log(`\nUser: ${userMessage}`);
  console.log('---');

  let response = await chat.sendMessage(userMessage);
  let iterations = 0;
  const MAX_ITERATIONS = 10; // safety cap against infinite loops

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const calls = response.response.functionCalls();

    if (!calls || calls.length === 0) break;

    // Run all requested tools in parallel
    const toolResults = await Promise.allSettled(
      calls.map(async (call) => {
        console.log(`Calling tool: ${call.name}(${JSON.stringify(call.args)})`);

        const handler = toolHandlers[call.name];

        if (!handler) {
          return {
            functionResponse: {
              name:     call.name,
              response: { error: `Unknown tool: ${call.name}` },
            },
          };
        }

        try {
          const result = await handler(call.args);
          console.log(`Tool result: ${JSON.stringify(result)}`);
          return {
            functionResponse: {
              name:     call.name,
              response: result,
            },
          };
        } catch (err) {
          return {
            functionResponse: {
              name:     call.name,
              response: { error: err.message },
            },
          };
        }
      })
    );

    // Extract fulfilled values — errors are already handled inside the map
    const parts = toolResults
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    // Send all results back to the model in one message
    response = await chat.sendMessage(parts);
  }

  return response.response.text();
}

module.exports = { runAgent };
