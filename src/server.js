// src/server.js
// Express HTTP server — exposes the agent as a POST /agent endpoint.

require('dotenv').config();
const express      = require('express');
const { runAgent } = require('./agent');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/agent', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required and must be a string' });
  }

  try {
    const answer = await runAgent(message);
    res.json({ answer });
  } catch (err) {
    console.error('[agent error]', err.message);
    res.status(500).json({ error: 'Agent failed to process the request' });
  }
});

app.listen(PORT, () => {
  console.log(`Agent server running on http://localhost:${PORT}`);
});
