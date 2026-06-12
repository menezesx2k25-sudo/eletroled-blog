import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://localhost:${port}`);
    const safePath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const finalPath = url.pathname.endsWith('/')
      ? path.join(root, safePath, 'index.html')
      : path.join(root, safePath);
    const content = await readFile(finalPath);
    res.writeHead(200, { 'content-type': mime[path.extname(finalPath)] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`Blog preview: http://localhost:${port}`);
});
