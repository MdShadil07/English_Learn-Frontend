import http from 'http';

const PORT = process.env.MOCK_TRANSCRIBE_PORT || 5000;

const sendJson = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/audio/transcribe') {
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        // For the mock, we simply echo back a placeholder transcript
        const transcript = parsed?.audioBase64 ? '(mock) Transcribed audio (dev mode)' : '';
        sendJson(res, 200, {
          success: true,
          message: 'Mock transcription successful',
          data: { transcript }
        });
      } catch (err) {
        sendJson(res, 400, { success: false, message: 'Invalid JSON' });
      }
    });
    return;
  }

  // Health route
  if (req.method === 'GET' && req.url === '/') {
    sendJson(res, 200, { success: true, message: 'Mock transcribe server running' });
    return;
  }

  sendJson(res, 404, { success: false, message: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`Mock transcription server listening on http://localhost:${PORT}`);
});
