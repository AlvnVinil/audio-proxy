const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple validation for URL param
function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

app.get('/', (req, res) => {
  const streamUrl = req.query.url;

  if (!streamUrl || !isValidUrl(streamUrl)) {
    return res.status(400).send('Invalid or missing "url" query parameter');
  }

  // Set response headers for audio streaming
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'no-cache');

  // Pipe the requested stream to the client
  request
    .get(streamUrl)
    .on('error', (err) => {
      console.error('Stream error:', err.message);
      res.status(500).send('Error fetching the stream');
    })
    .pipe(res);
});

app.listen(PORT, () => {
  console.log(`Dynamic radio proxy running on port ${PORT}`);
});
