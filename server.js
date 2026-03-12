import express from 'express';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.resolve(__dirname, 'data.json');
const distPath = path.resolve(__dirname, 'dist');
const indexHtmlPath = path.resolve(distPath, 'index.html');

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3001', 10);

app.use(express.json());

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

async function readDataFile() {
  const fileText = await fs.readFile(dataFilePath, 'utf8');
  const json = JSON.parse(fileText);

  if (!Array.isArray(json.bookmarks)) {
    throw new Error('Invalid data.json format: bookmarks must be an array.');
  }

  return json;
}

async function writeDataFile(json) {
  await fs.writeFile(dataFilePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

function normalizeTagList(tags) {
  if (!Array.isArray(tags)) return undefined;
  return tags.map((tag) => String(tag).trim()).filter(Boolean);
}

function buildUpdatesFromPayload(payload) {
  const updates = {};

  if (typeof payload.title === 'string') updates.title = payload.title.trim();
  if (typeof payload.description === 'string') updates.description = payload.description.trim();
  if (typeof payload.url === 'string') updates.url = payload.url.trim();
  if (typeof payload.pinned === 'boolean') updates.pinned = payload.pinned;
  if (typeof payload.isArchived === 'boolean') updates.isArchived = payload.isArchived;

  const normalizedTags = normalizeTagList(payload.tags);
  if (normalizedTags !== undefined) updates.tags = normalizedTags;

  return updates;
}

function validateUpdates(updates) {
  if ('title' in updates && !updates.title) return 'Title is required.';
  if ('url' in updates && !updates.url) return 'URL is required.';
  if ('tags' in updates && updates.tags.length === 0) return 'At least one tag is required.';
  return null;
}

function createBookmarkId(bookmarks) {
  const maxIdNumber = bookmarks.reduce((max, bookmark) => {
    const match = /^bm-(\d+)$/.exec(String(bookmark.id || ''));
    if (!match) return max;
    const current = Number.parseInt(match[1], 10);
    return Number.isNaN(current) ? max : Math.max(max, current);
  }, 0);

  const nextIdNumber = maxIdNumber + 1;
  return `bm-${String(nextIdNumber).padStart(3, '0')}`;
}

app.get('/api/bookmarks', async (_req, res) => {
  try {
    const json = await readDataFile();
    sendJson(res, 200, { bookmarks: json.bookmarks });
  } catch (error) {
    sendJson(res, 500, { error: 'Failed to read bookmarks.' });
  }
});

app.post('/api/bookmarks', async (req, res) => {
  try {
    const json = await readDataFile();
    const updates = buildUpdatesFromPayload(req.body || {});
    const validationError = validateUpdates(updates);

    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return;
    }

    if (!updates.title || !updates.url || !updates.tags) {
      sendJson(res, 400, { error: 'Title, URL, and at least one tag are required.' });
      return;
    }

    const newBookmark = {
      id: createBookmarkId(json.bookmarks),
      title: updates.title,
      description: updates.description || '',
      url: updates.url,
      tags: updates.tags,
      pinned: false,
      isArchived: false,
      visitCount: 0,
      createdAt: new Date().toISOString(),
      lastVisited: null,
    };

    json.bookmarks.push(newBookmark);
    await writeDataFile(json);

    sendJson(res, 201, { bookmark: newBookmark });
  } catch (error) {
    sendJson(res, 500, { error: 'Failed to create bookmark.' });
  }
});

app.patch('/api/bookmarks/:id', async (req, res) => {
  try {
    const bookmarkId = req.params.id;
    if (!bookmarkId) {
      sendJson(res, 400, { error: 'Bookmark id is required.' });
      return;
    }

    const updates = buildUpdatesFromPayload(req.body || {});
    const validationError = validateUpdates(updates);

    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return;
    }

    if (Object.keys(updates).length === 0) {
      sendJson(res, 400, { error: 'No valid fields provided for update.' });
      return;
    }

    const json = await readDataFile();
    const bookmarkIndex = json.bookmarks.findIndex((bookmark) => bookmark.id === bookmarkId);

    if (bookmarkIndex === -1) {
      sendJson(res, 404, { error: 'Bookmark not found.' });
      return;
    }

    const updatedBookmark = {
      ...json.bookmarks[bookmarkIndex],
      ...updates,
    };

    json.bookmarks[bookmarkIndex] = updatedBookmark;
    await writeDataFile(json);

    sendJson(res, 200, { bookmark: updatedBookmark });
  } catch (error) {
    sendJson(res, 500, { error: 'Failed to update bookmark.' });
  }
});

app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    const bookmarkId = req.params.id;
    if (!bookmarkId) {
      sendJson(res, 400, { error: 'Bookmark id is required.' });
      return;
    }

    const json = await readDataFile();
    const bookmarkIndex = json.bookmarks.findIndex((bookmark) => bookmark.id === bookmarkId);

    if (bookmarkIndex === -1) {
      sendJson(res, 404, { error: 'Bookmark not found.' });
      return;
    }

    const [deletedBookmark] = json.bookmarks.splice(bookmarkIndex, 1);
    await writeDataFile(json);

    sendJson(res, 200, { bookmark: deletedBookmark });
  } catch (error) {
    sendJson(res, 500, { error: 'Failed to delete bookmark.' });
  }
});

if (existsSync(indexHtmlPath)) {
  app.use(express.static(distPath));

  // Serve React SPA for non-API GET requests in production deployment.
  app.use((req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(indexHtmlPath);
  });
}

app.listen(PORT, () => {
  console.log(`Bookmark API listening on http://localhost:${PORT}`);
});
