const express = require('express');

const app = express();
const PORT = 5000;

app.get('/health-check', (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});