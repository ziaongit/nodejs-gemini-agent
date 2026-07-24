// src/tools.js
// Tool definitions (schemas) passed to Gemini so it knows what functions are available.
// The model reads these descriptions to decide when and how to call each tool.

const toolDefinitions = [
  {
    name: 'get_weather',
    description:
      'Get the current weather for a city. Returns temperature in Celsius, ' +
      'humidity percentage, and wind speed. Use this when the user asks about ' +
      'weather, temperature, or climate conditions in any location.',
    parameters: {
      type: 'OBJECT',
      properties: {
        city: {
          type: 'STRING',
          description: 'The city name, e.g. Tokyo, London, New York',
        },
      },
      required: ['city'],
    },
  },
  {
    name: 'calculate',
    description:
      'Evaluate a mathematical expression and return the numeric result. ' +
      'Use this for arithmetic, percentage calculations, or any numeric computation ' +
      'the user asks for. Do not guess at math — always call this tool.',
    parameters: {
      type: 'OBJECT',
      properties: {
        expression: {
          type: 'STRING',
          description:
            'A valid mathematical expression, e.g. "47.50 * 0.18" or "1500 / 12"',
        },
      },
      required: ['expression'],
    },
  },
  {
    name: 'get_exchange_rate',
    description:
      'Get the current exchange rate between two currencies. Can also convert ' +
      'a specific amount. Use this when the user asks about currency conversion, ' +
      'exchange rates, or how much a foreign currency amount is worth.',
    parameters: {
      type: 'OBJECT',
      properties: {
        from: {
          type: 'STRING',
          description: 'The source currency code, e.g. USD, EUR, JPY, GBP',
        },
        to: {
          type: 'STRING',
          description: 'The target currency code, e.g. USD, EUR, JPY, GBP',
        },
        amount: {
          type: 'NUMBER',
          description:
            'Amount to convert. Optional — defaults to 1 if not provided.',
        },
      },
      required: ['from', 'to'],
    },
  },
];

module.exports = { toolDefinitions };
