/**
 * ToonWish Reels: Family Birthday WhatsApp Video Reel Generator Server
 * Port: Strictly 30001
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 30001;

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'reels.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Clean Database initialization
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return {
        parties: data.parties || {},
        wishes: data.wishes || [],
      };
    } catch (e) {
      console.error('Error reading reels.json, initializing clean DB', e);
    }
  }
  const cleanDb = { parties: {}, wishes: [] };
  fs.writeFileSync(DB_FILE, JSON.stringify(cleanDb, null, 2));
  return cleanDb;
}

function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Multer disk storage for photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/wish', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-wish.html'));
});

app.get('/reel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reel.html'));
});

// Helper to remove files from disk
function deleteFileIfExists(fileUrl) {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  const filename = path.basename(fileUrl);
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('Could not delete file:', filePath);
    }
  }
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Create a New Birthday Party Reel Project
app.post('/api/parties', upload.single('kidPhoto'), (req, res) => {
  try {
    const { kidName, kidAge, celebrationTheme, kidPhotoBase64 } = req.body;

    if (!kidName || !kidName.trim()) {
      return res.status(400).json({ error: 'Kid name is required' });
    }

    const db = loadDatabase();
    const partyId = 'party-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    // Save kid photo
    let kidPhotoUrl = '/assets/default-user.svg';
    if (req.file) {
      kidPhotoUrl = `/uploads/${req.file.filename}`;
    } else if (kidPhotoBase64 && kidPhotoBase64.startsWith('data:image')) {
      const filename = `kid-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const base64Data = kidPhotoBase64.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(base64Data, 'base64'));
      kidPhotoUrl = `/uploads/${filename}`;
    }

    const newParty = {
      id: partyId,
      kidName: kidName.trim(),
      kidAge: parseInt(kidAge, 10) || 5,
      celebrationTheme: celebrationTheme || 'gold-festive',
      kidPhotoUrl,
      createdAt: new Date().toISOString(),
    };

    db.parties[partyId] = newParty;
    saveDatabase(db);

    res.json({ success: true, party: newParty });
  } catch (err) {
    console.error('Error creating party:', err);
    res.status(500).json({ error: 'Failed to create party reel' });
  }
});

// 2. List all parties
app.get('/api/parties', (req, res) => {
  const db = loadDatabase();
  const list = Object.values(db.parties || {}).map((p) => {
    const wishList = (db.wishes || []).filter((w) => w.partyId === p.id);
    return {
      ...p,
      wishCount: wishList.length,
      recentWishes: wishList.slice(-3),
    };
  });
  res.json({ parties: list });
});

// 3. Get single party with its family wishes
app.get('/api/parties/:id', (req, res) => {
  const partyId = req.params.id;
  const db = loadDatabase();
  const party = db.parties[partyId];

  if (!party) {
    return res.status(404).json({ error: 'Birthday party reel not found' });
  }

  const wishes = (db.wishes || []).filter((w) => w.partyId === partyId);
  res.json({ party, wishes });
});

// 4. Delete Party and its files
app.delete('/api/parties/:id', (req, res) => {
  const partyId = req.params.id;
  const db = loadDatabase();

  if (!db.parties[partyId]) {
    return res.status(404).json({ error: 'Party not found' });
  }

  deleteFileIfExists(db.parties[partyId].kidPhotoUrl);

  const relatedWishes = (db.wishes || []).filter((w) => w.partyId === partyId);
  relatedWishes.forEach((w) => deleteFileIfExists(w.photoUrl));

  delete db.parties[partyId];
  db.wishes = (db.wishes || []).filter((w) => w.partyId !== partyId);
  saveDatabase(db);

  res.json({ success: true, message: 'Party and wishes deleted successfully' });
});

// 5. Submit Family Member Photo & Comment
app.post('/api/parties/:id/wishes', upload.single('photo'), (req, res) => {
  try {
    const partyId = req.params.id;
    const { senderName, relation, comment, photoBase64 } = req.body;

    if (!senderName || !senderName.trim()) {
      return res.status(400).json({ error: 'Sender name is required' });
    }

    const db = loadDatabase();
    if (!db.parties[partyId]) {
      return res.status(404).json({ error: 'Party not found' });
    }

    let photoUrl = '/assets/default-user.svg';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (photoBase64 && photoBase64.startsWith('data:image')) {
      const filename = `family-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(base64Data, 'base64'));
      photoUrl = `/uploads/${filename}`;
    }

    const newWish = {
      id: 'wish-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      partyId,
      senderName: senderName.trim(),
      relation: relation ? relation.trim() : 'Family',
      comment: comment ? comment.trim() : 'Happy Birthday champ! Lots of love and blessings! ❤️🎉',
      photoUrl,
      createdAt: new Date().toISOString(),
    };

    db.wishes = db.wishes || [];
    db.wishes.push(newWish);
    saveDatabase(db);

    res.json({ success: true, wish: newWish });
  } catch (err) {
    console.error('Error submitting wish:', err);
    res.status(500).json({ error: 'Failed to submit wish' });
  }
});

// 6. Delete single wish
app.delete('/api/wishes/:id', (req, res) => {
  const wishId = req.params.id;
  const db = loadDatabase();
  const wishIndex = (db.wishes || []).findIndex((w) => w.id === wishId);

  if (wishIndex === -1) {
    return res.status(404).json({ error: 'Wish not found' });
  }

  deleteFileIfExists(db.wishes[wishIndex].photoUrl);
  db.wishes.splice(wishIndex, 1);
  saveDatabase(db);

  res.json({ success: true, message: 'Wish removed' });
});

// Start server strictly on port 30001
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🎬 ToonWish: WhatsApp Birthday Video Reel Generator`);
  console.log(`🚀 Live URL: http://localhost:${PORT}`);
  console.log(`📱 Reel Player: http://localhost:${PORT}/reel`);
  console.log(`💌 Add Wish: http://localhost:${PORT}/wish`);
  console.log(`=======================================================`);
});
