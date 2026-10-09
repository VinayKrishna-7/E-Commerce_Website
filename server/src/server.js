require('dotenv').config();
const http = require('http');
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`[ShopEase Server] Listening on http://localhost:${PORT}`);
  try {
    await prisma.$connect();
    console.log('[ShopEase Server] PostgreSQL connected successfully.');
  } catch (err) {
    console.error('[ShopEase Server] Database connection error:', err.message);
  }
});

// Graceful termination
process.on('SIGINT', async () => {
  console.log('\n[ShopEase Server] Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('[ShopEase Server] Closed HTTP server and disconnected Prisma.');
    process.exit(0);
  });
});
