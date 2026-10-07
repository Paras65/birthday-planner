const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 30001;

// Ensure storage directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialize database with default sample party if empty
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (err) {
      console.error('Error reading db.json, reinitializing', err);
    }
  }

  const initialDb = {
    parties: {},
    wishes: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  return initialDb;
}

function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Multer storage setup for selfies and voice recordings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || (file.mimetype.includes('audio') ? '.webm' : '.png');
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static frontend assets and uploaded files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Page routes
app.get('/wish', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wish.html'));
});

app.get('/showtime', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'showtime.html'));
});

// API Routes

// 1. Create or get Party
app.post('/api/parties', (req, res) => {
  const { kidName, kidAge, birthdayDate, themeColor } = req.body;
  if (!kidName) {
    return res.status(400).json({ error: 'Kid name is required' });
  }

  const db = loadDatabase();
  const slug = kidName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
  const partyId = slug;

  const party = {
    id: partyId,
    kidName: kidName.trim(),
    kidAge: parseInt(kidAge, 10) || 5,
    birthdayDate: birthdayDate || new Date().toISOString().split('T')[0],
    themeColor: themeColor || '#ff4d94',
    createdAt: new Date().toISOString(),
  };

  db.parties[partyId] = party;
  saveDatabase(db);

  res.json({ success: true, party });
});

// 1b. List all parties (for dashboard)
app.get('/api/parties', (req, res) => {
  const db = loadDatabase();
  const list = Object.values(db.parties || {}).map((p) => {
    const count = (db.wishes || []).filter((w) => w.partyId === p.id).length;
    return { ...p, wishCount: count };
  });
  res.json({ parties: list });
});

// 2. Get Party details with its wishes
app.get('/api/parties/:id', (req, res) => {
  const partyId = req.params.id;
  const db = loadDatabase();
  const party = db.parties[partyId];

  if (!party) {
    return res.status(404).json({ error: 'Birthday party room not found' });
  }

  const wishes = (db.wishes || []).filter((w) => w.partyId === partyId);
  res.json({ party, wishes });
});

// Helper to delete physical uploaded files from disk
function deleteUploadedFile(fileUrl) {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  const filename = path.basename(fileUrl);
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file from disk: ${filename}`);
    } catch (err) {
      console.error(`Failed to delete file from disk: ${filePath}`, err);
    }
  }
}

// 2b. Clear/Reset all wishes for a party (and delete its uploaded files)
app.post('/api/parties/:id/clear', (req, res) => {
  const partyId = req.params.id;
  const db = loadDatabase();

  if (!db.parties[partyId]) {
    return res.status(404).json({ error: 'Party room not found' });
  }

  // Find wishes to remove and delete their physical files
  const wishesToRemove = (db.wishes || []).filter((w) => w.partyId === partyId);
  wishesToRemove.forEach((w) => {
    deleteUploadedFile(w.selfieUrl);
    deleteUploadedFile(w.audioUrl);
  });

  // Remove wishes from database
  db.wishes = (db.wishes || []).filter((w) => w.partyId !== partyId);
  saveDatabase(db);

  res.json({ success: true, message: 'All wishes and uploaded files deleted for this party!' });
});

// 2c. Delete party room completely (and delete its uploaded files)
app.delete('/api/parties/:id', (req, res) => {
  const partyId = req.params.id;
  const db = loadDatabase();

  if (!db.parties[partyId]) {
    return res.status(404).json({ error: 'Party room not found' });
  }

  // Find wishes to remove and delete their physical files
  const wishesToRemove = (db.wishes || []).filter((w) => w.partyId === partyId);
  wishesToRemove.forEach((w) => {
    deleteUploadedFile(w.selfieUrl);
    deleteUploadedFile(w.audioUrl);
  });

  delete db.parties[partyId];
  db.wishes = (db.wishes || []).filter((w) => w.partyId !== partyId);
  saveDatabase(db);

  res.json({ success: true, message: 'Party room and all uploaded files deleted successfully!' });
});

// 2d. Clean up any orphaned uploads not linked to any active wish
app.post('/api/cleanup-uploads', (req, res) => {
  const db = loadDatabase();
  const activeFiles = new Set();
  (db.wishes || []).forEach((w) => {
    if (w.selfieUrl && w.selfieUrl.startsWith('/uploads/')) activeFiles.add(path.basename(w.selfieUrl));
    if (w.audioUrl && w.audioUrl.startsWith('/uploads/')) activeFiles.add(path.basename(w.audioUrl));
  });

  let deletedCount = 0;
  if (fs.existsSync(UPLOADS_DIR)) {
    const diskFiles = fs.readdirSync(UPLOADS_DIR);
    diskFiles.forEach((file) => {
      if (!activeFiles.has(file)) {
        try {
          fs.unlinkSync(path.join(UPLOADS_DIR, file));
          deletedCount++;
          console.log(`🧹 Cleaned up orphan file: ${file}`);
        } catch (e) {
          console.error('Error unlinking', file, e);
        }
      }
    });
  }

  res.json({ success: true, deletedCount });
});

// 3. Submit a family member's wish
app.post(
  '/api/wishes',
  upload.fields([
    { name: 'selfie', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const {
        partyId,
        senderName,
        relation,
        message,
        characterId,
        voiceType,
        selfieBase64,
      } = req.body;

      if (!partyId || !senderName) {
        return res.status(400).json({ error: 'Party ID and sender name are required' });
      }

      const db = loadDatabase();
      if (!db.parties[partyId]) {
        return res.status(404).json({ error: 'Birthday party not found' });
      }

      let selfieUrl = '';
      if (req.files && req.files['selfie'] && req.files['selfie'][0]) {
        selfieUrl = `/uploads/${req.files['selfie'][0].filename}`;
      } else if (selfieBase64 && selfieBase64.startsWith('data:image')) {
        // Save base64 image to disk
        const filename = `selfie-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        const base64Data = selfieBase64.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(base64Data, 'base64'));
        selfieUrl = `/uploads/${filename}`;
      }

      let audioUrl = '';
      if (req.files && req.files['audio'] && req.files['audio'][0]) {
        audioUrl = `/uploads/${req.files['audio'][0].filename}`;
      }

      const newWish = {
        id: 'wish-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        partyId,
        senderName: senderName.trim(),
        relation: relation ? relation.trim() : 'Family',
        message: message ? message.trim() : 'Happy Birthday!',
        characterId: characterId || 'mimi',
        voiceType: voiceType === 'audio' && audioUrl ? 'audio' : 'tts',
        selfieUrl: selfieUrl || '/assets/default-avatar.svg',
        audioUrl: audioUrl || null,
        reactions: { hug: 0, kiss: 0, highfive: 0 },
        createdAt: new Date().toISOString(),
      };

      db.wishes.push(newWish);
      saveDatabase(db);

      res.json({ success: true, wish: newWish });
    } catch (err) {
      console.error('Error saving wish:', err);
      res.status(500).json({ error: 'Failed to save wish' });
    }
  }
);

// 4. Send Kid Reaction to a Wish
app.post('/api/wishes/:id/reaction', (req, res) => {
  const wishId = req.params.id;
  const { type } = req.body; // 'hug', 'kiss', or 'highfive'

  if (!['hug', 'kiss', 'highfive'].includes(type)) {
    return res.status(400).json({ error: 'Invalid reaction type' });
  }

  const db = loadDatabase();
  const wish = (db.wishes || []).find((w) => w.id === wishId);
  if (!wish) {
    return res.status(404).json({ error: 'Wish not found' });
  }

  wish.reactions = wish.reactions || { hug: 0, kiss: 0, highfive: 0 };
  wish.reactions[type] = (wish.reactions[type] || 0) + 1;

  saveDatabase(db);
  res.json({ success: true, reactions: wish.reactions });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎉 KidBirthday App is running at http://localhost:${PORT}`);
  console.log(`- Host Portal: http://localhost:${PORT}/`);
  console.log(`- Family Wish Link (Demo): http://localhost:${PORT}/wish?party=demo-kid`);
  console.log(`- Grand Showtime Stage (Demo): http://localhost:${PORT}/showtime?party=demo-kid`);
});

