// src/agent.js
// The agentic loop. Sends the user message to Gemini, handles any function calls,
// sends results back, and repeats until the model returns a plain text answer.

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { toolDefinitions }    = require('./tools');
const { get_weather, calculate, get_exchange_rate } = require('./functions');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

  // Agentic loop — keep running while the model wants to call tools
  while (true) {
    const calls = response.response.functionCalls();

    if (!calls || calls.length === 0) break;

    const toolResults = [];

    for (const call of calls) {
      console.log(`Calling tool: ${call.name}(${JSON.stringify(call.args)})`);

      const handler = toolHandlers[call.name];
      let result;

      if (!handler) {
        result = { error: `Unknown tool: ${call.name}` };
      } else {
        try {
          result = await handler(call.args);
        } catch (err) {
          result = { error: err.message };
        }
      }

      console.log(`Tool result: ${JSON.stringify(result)}`);

      toolResults.push({
        functionResponse: {
          name:     call.name,
          response: result,
        },
      });
    }

    // Send all results back to the model in a single message
    response = await chat.sendMessage(toolResults);
  }

  return response.response.text();
}

module.exports = { runAgent };
