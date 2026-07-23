// src/tools.js
// Tool definitions (schemas) passed to Gemini so it knows what functions are available.
// The model reads these descriptions to decide when and how to call each tool.

const toolDefinitions = [
  {
    name: 'get_weather',
    description:
      'Get the current weather for a city. Returns temperature in Celsius, weather description, wind speed, and humidity.',
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
      'Evaluate a mathematical expression and return the result. Use this for any arithmetic, percentages, or numeric calculations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        expression: {
          type: 'STRING',
          description: 'A valid mathematical expression, e.g. "15 * 4 + 200 / 2"',
        },
      },
      required: ['expression'],
    },
  },
  {
    name: 'get_exchange_rate',
    description:
      'Get the current exchange rate between two currencies and optionally convert an amount.',
    parameters: {
      type: 'OBJECT',
      properties: {
        from: {
          type: 'STRING',
          description: 'The source currency code, e.g. USD, EUR, JPY',
        },
        to: {
          type: 'STRING',
          description: 'The target currency code, e.g. USD, EUR, JPY',
        },
        amount: {
          type: 'NUMBER',
          description: 'Optional amount to convert. Defaults to 1.',
        },
      },
      required: ['from', 'to'],
    },
  },
];

module.exports = { toolDefinitions };
