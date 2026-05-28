const express = require('express');
const cors = require('cors');
require('dotenv').config();

const documentsRouter = require('./routes/documents');
const foldersRouter = require('./routes/folders');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/docs', documentsRouter);
app.use('/api/folders', foldersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
