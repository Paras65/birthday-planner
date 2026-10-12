/**
 * ToonHero Storybook: AI Animated Birthday Adventure & Video Generator Server
 * Port: 30001 (Strictly enforced)
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const googleTTS = require('google-tts-api');

const app = express();
const PORT = process.env.PORT || 30001;

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'stories.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Initialize Database without dummy records
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return {
        stories: data.stories || {},
        scrolls: data.scrolls || [],
      };
    } catch (e) {
      console.error('Error reading stories.json, reinitializing clean db', e);
    }
  }
  const cleanDb = { stories: {}, scrolls: [] };
  fs.writeFileSync(DB_FILE, JSON.stringify(cleanDb, null, 2));
  return cleanDb;
}

function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Multer storage for hero selfies and family photos
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
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/story', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'story.html'));
});

app.get('/scroll', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scroll.html'));
});

// Helper to remove files
function deleteUploadedFile(fileUrl) {
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
// STORY GENERATOR ENGINE (Personalized 5-Chapter Adventure)
// ==========================================
function generateStoryChapters(params) {
  const { kidName, kidAge, gender, heroTitle, theme, sidekick, favoriteFood, favoritePower } = params;

  const title = heroTitle || 'Super Hero';
  const food = favoriteFood || 'Birthday Cake';
  const power = favoritePower || 'Super Speed';

  // Sidekick metadata
  const sidekickNames = {
    shinchan: 'Shinchan (👦 Shararati Buddy)',
    bheem: 'Chhota Bheem (🦸 Dholakpur Champ)',
    tom: 'Talking Tom (🐱 Funny Cat)',
    chintu: 'Robo Chintu (🤖 Flying Drone Buddy)',
  };
  const companion = sidekickNames[sidekick] || 'Talking Tom (🐱 Funny Cat)';

  // Theme-specific scenarios
  const themeScenarios = {
    cosmic: {
      name: 'Cosmic Superhero Adventure',
      realm: 'Mega City & Starlight Sky',
      questItem: 'The Golden Birthday Spark Crystal',
      villain: 'The Shadow of Boredom',
      chapter1Bg: 'city-morning',
      chapter2Bg: 'secret-rooftop',
      chapter3Bg: 'sky-blaster',
      chapter4Bg: 'vault-crystals',
      chapter5Bg: 'grand-celebration',
    },
    space: {
      name: 'Galaxy Space Odyssey',
      realm: 'The Candy Nebula & Planet Birthday',
      questItem: 'The Cosmic Birthday Core',
      villain: 'Space Dust Storm',
      chapter1Bg: 'space-rocket',
      chapter2Bg: 'candy-planet',
      chapter3Bg: 'meteor-challenge',
      chapter4Bg: 'starlight-temple',
      chapter5Bg: 'intergalactic-party',
    },
    kingdom: {
      name: 'Magical Kingdom Royalty',
      realm: 'The Enchanted Fairy Realm',
      questItem: 'The Golden Crown of Infinite Smiles',
      villain: 'The Grumpy Cloud',
      chapter1Bg: 'palace-sunrise',
      chapter2Bg: 'enchanted-forest',
      chapter3Bg: 'magic-bridge',
      chapter4Bg: 'treasure-throne',
      chapter5Bg: 'royal-coronation',
    },
    jungle: {
      name: 'Dino & Jungle Safari',
      realm: 'The Secret Dino Valley',
      questItem: 'The Ancient Golden Birthday Egg',
      villain: 'The Sleepy T-Rex',
      chapter1Bg: 'jungle-treehouse',
      chapter2Bg: 'dino-meadow',
      chapter3Bg: 'rope-river',
      chapter4Bg: 'dino-nest',
      chapter5Bg: 'jungle-carnival',
    },
    racer: {
      name: 'Grand Birthday Speed Racing',
      realm: 'Turbo Rainbow Highway',
      questItem: 'The Golden Championship Trophy',
      villain: 'The Pothole Tricksters',
      chapter1Bg: 'garage-prep',
      chapter2Bg: 'pitstop-crew',
      chapter3Bg: 'turbo-loop',
      chapter4Bg: 'victory-podium',
      chapter5Bg: 'stadium-fireworks',
    },
  };

  const sc = themeScenarios[theme] || themeScenarios.cosmic;

  return [
    {
      chapterNumber: 1,
      title: `Chapter 1: The Call of Destiny!`,
      subtitle: `${kidName} turns ${kidAge} Today!`,
      backdrop: sc.chapter1Bg,
      narration: `Suno suno! Aaj ka din aam din nahi hai! Hamare pyare aur bahadur ${kidName} ka ${kidAge}th birthday hai! Poore shehar mein ghantiyaan baj uthi hain, kyunki aaj ${kidName} ko mili hai unki sabse badi superpower: ${power}! Cartoon Command Center se emergency siren bajta hai: "Hero ${kidName}, aao aur birthday mission shuru karo!"`,
      dialogue: {
        speaker: kidName,
        text: `Main ready hoon! Aaj mera ${kidAge}th birthday hai aur main kisi ko udaas nahi rehne doonga! Let's go!`,
      },
      interactivePrompt: `Tap on ${kidName} to activate the hero suit & cape! ✨`,
      powerWord: power,
    },
    {
      chapterNumber: 2,
      title: `Chapter 2: The Sidekick Alliance!`,
      subtitle: `Meet Companion ${companion}`,
      backdrop: sc.chapter2Bg,
      narration: `Hero ${kidName} jab aage badhte hain, toh raste mein unhein milta hai unka sabse funny dost — ${companion}! Unke hath mein ek badi plate ${food} thi! Dost bola: "Arre waah ${kidName}! Aaj toh party time hai! Lekin pehle humein ${sc.questItem} dhoondhna hoga!" Dono ne taali maari aur chal pade mission par!`,
      dialogue: {
        speaker: companion.split(' ')[0],
        text: `Oye hoye ${kidName}! Tum toh aaj asman mein chamak rahe ho! Pehle ${food} khao, fir villains ko haraenge!`,
      },
      interactivePrompt: `Tap the high-five button to team up! ✋`,
      powerWord: food,
    },
    {
      chapterNumber: 3,
      title: `Chapter 3: The Ultimate Birthday Challenge!`,
      subtitle: `Crossing ${sc.realm}`,
      backdrop: sc.chapter3Bg,
      narration: `Raste mein ek bada toofan aaya! Lekin kya hamare hero darenge? Bilkul nahi! ${kidName} ne apni ${power} use ki! Unhone 10 magical balloons ko hawa mein pop kiya aur raasta bilkul saaf kar diya! Sabhi cartoon dost chillaye: "Hip Hip Hurray for ${kidName}!"`,
      dialogue: {
        speaker: kidName,
        text: `Meri superpowers ke aage koi toofan nahi tik sakta! Birthday magic se rasta khul gaya!`,
      },
      interactivePrompt: `Pop the 3 floating magic power orbs on screen to unleash turbo speed! 🎈`,
      powerWord: 'Magic Power',
    },
    {
      chapterNumber: 4,
      title: `Chapter 4: The Vault of Magic Scrolls!`,
      subtitle: `Family Wishes & Secret Treasures`,
      backdrop: sc.chapter4Bg,
      narration: `Aakhirkar ${kidName} pahunche us Gupt Khazane ke paas! Aur wahan kya tha? Chamakte hue Magic Scrolls aur Gems! Yeh scrolls koi aam kagaz nahi the — yeh the Mummy, Papa, Dadi, Chacha aur sabhi doston ke dil se nikle hue pyare aashirwaad aur wishes! Har scroll se roshni nikal rahi thi!`,
      dialogue: {
        speaker: companion.split(' ')[0],
        text: `Dekho ${kidName}! Sabhi relatives aur family members ne tumhare liye kitna pyara surprise bheja hai!`,
      },
      interactivePrompt: `Tap each glowing Gem to open the family wish scrolls! 📜✨`,
      powerWord: 'Family Love',
    },
    {
      chapterNumber: 5,
      title: `Chapter 5: The Grand Coronation & Cake Fireworks!`,
      subtitle: `Happy ${kidAge}th Birthday, Superstar!`,
      backdrop: sc.chapter5Bg,
      narration: `Dhoom dhaam se grand stage saj chuka hai! Poora sansaar ek aawaz mein ga raha hai: "Happy Birthday to you, Happy Birthday dear ${kidName}!" Asman mein roshni aur aatishbazi bikhar gayi! ${kidName} ne cake ki candles blow ki aur sabhi doston ne cake khilaya! Hamara hero hamesha muskurata rahe! THE END... Aur Nayi Masti Ki Shuruat!`,
      dialogue: {
        speaker: 'All Cartoon Friends',
        text: `Aap jiyo hazaaron saal, saal ke din hon pachas hazaar! Happy Birthday ${kidName}! 🎉🎂🥳`,
      },
      interactivePrompt: `Tap the Grand Cake to blow candles & launch sky fireworks! 🎆🍰`,
      powerWord: 'Superstar',
    },
  ];
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Create a New Storybook
app.post('/api/stories', upload.single('heroFace'), (req, res) => {
  try {
    const {
      kidName,
      kidAge,
      gender,
      heroTitle,
      theme,
      sidekick,
      favoriteFood,
      favoritePower,
      heroFaceBase64,
    } = req.body;

    if (!kidName || !kidName.trim()) {
      return res.status(400).json({ error: 'Kid Name is required' });
    }

    const db = loadDatabase();
    const storyId = 'story-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    // Save hero face image
    let heroFaceUrl = '/assets/default-hero.svg';
    if (req.file) {
      heroFaceUrl = `/uploads/${req.file.filename}`;
    } else if (heroFaceBase64 && heroFaceBase64.startsWith('data:image')) {
      const filename = `hero-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const base64Data = heroFaceBase64.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(base64Data, 'base64'));
      heroFaceUrl = `/uploads/${filename}`;
    }

    const storyParams = {
      kidName: kidName.trim(),
      kidAge: parseInt(kidAge, 10) || 5,
      gender: gender || 'boy',
      heroTitle: heroTitle ? heroTitle.trim() : 'Super Hero',
      theme: theme || 'cosmic',
      sidekick: sidekick || 'shinchan',
      favoriteFood: favoriteFood ? favoriteFood.trim() : 'Birthday Cake & Laddoo',
      favoritePower: favoritePower ? favoritePower.trim() : 'Super Flight & Mega Smile',
    };

    const chapters = generateStoryChapters(storyParams);

    const newStory = {
      id: storyId,
      ...storyParams,
      heroFaceUrl,
      chapters,
      createdAt: new Date().toISOString(),
    };

    db.stories[storyId] = newStory;
    saveDatabase(db);

    res.json({ success: true, story: newStory });
  } catch (err) {
    console.error('Error creating story:', err);
    res.status(500).json({ error: 'Failed to create storybook' });
  }
});

// 2. List All Stories
app.get('/api/stories', (req, res) => {
  const db = loadDatabase();
  const list = Object.values(db.stories || {}).map((s) => {
    const scrollsCount = (db.scrolls || []).filter((sc) => sc.storyId === s.id).length;
    return {
      ...s,
      scrollsCount,
    };
  });
  res.json({ stories: list });
});

// 3. Get Single Story with Family Scrolls
app.get('/api/stories/:id', (req, res) => {
  const storyId = req.params.id;
  const db = loadDatabase();
  const story = db.stories[storyId];

  if (!story) {
    return res.status(404).json({ error: 'Storybook not found' });
  }

  const scrolls = (db.scrolls || []).filter((sc) => sc.storyId === storyId);
  res.json({ story, scrolls });
});

// 4. Delete Storybook
app.delete('/api/stories/:id', (req, res) => {
  const storyId = req.params.id;
  const db = loadDatabase();

  if (!db.stories[storyId]) {
    return res.status(404).json({ error: 'Storybook not found' });
  }

  deleteUploadedFile(db.stories[storyId].heroFaceUrl);

  const relatedScrolls = (db.scrolls || []).filter((sc) => sc.storyId === storyId);
  relatedScrolls.forEach((sc) => deleteUploadedFile(sc.photoUrl));

  delete db.stories[storyId];
  db.scrolls = (db.scrolls || []).filter((sc) => sc.storyId !== storyId);
  saveDatabase(db);

  res.json({ success: true, message: 'Storybook deleted successfully' });
});

// 5. Submit a Family Secret Wish Scroll
app.post(
  '/api/stories/:id/scrolls',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const storyId = req.params.id;
      const { senderName, relation, message, gemColor, photoBase64 } = req.body;

      if (!senderName || !senderName.trim()) {
        return res.status(400).json({ error: 'Sender name is required' });
      }

      const db = loadDatabase();
      if (!db.stories[storyId]) {
        return res.status(404).json({ error: 'Storybook not found' });
      }

      let photoUrl = '';
      if (req.files && req.files['photo'] && req.files['photo'][0]) {
        photoUrl = `/uploads/${req.files['photo'][0].filename}`;
      } else if (photoBase64 && photoBase64.startsWith('data:image')) {
        const filename = `scroll-photo-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(base64Data, 'base64'));
        photoUrl = `/uploads/${filename}`;
      }

      let audioUrl = '';
      if (req.files && req.files['audio'] && req.files['audio'][0]) {
        audioUrl = `/uploads/${req.files['audio'][0].filename}`;
      }

      const newScroll = {
        id: 'scroll-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        storyId,
        senderName: senderName.trim(),
        relation: relation ? relation.trim() : 'Family',
        message: message ? message.trim() : 'Happy Birthday Champ! Keep shining!',
        gemColor: gemColor || '#ec4899',
        photoUrl: photoUrl || '/assets/default-hero.svg',
        audioUrl: audioUrl || null,
        createdAt: new Date().toISOString(),
      };

      db.scrolls = db.scrolls || [];
      db.scrolls.push(newScroll);
      saveDatabase(db);

      res.json({ success: true, scroll: newScroll });
    } catch (err) {
      console.error('Error adding scroll:', err);
      res.status(500).json({ error: 'Failed to submit scroll' });
    }
  }
);

// 6. Google TTS Generator for Lively Hindi / English Narration
app.get('/api/tts', async (req, res) => {
  try {
    const text = (req.query.text || '').trim();
    const lang = req.query.lang || 'hi';
    if (!text) {
      return res.status(400).json({ error: 'Text query parameter is required' });
    }

    const safeText = text.substring(0, 350);
    const parts = await googleTTS.getAllAudioBase64(safeText, {
      lang: lang === 'en' ? 'en' : 'hi',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 8000,
    });

    const buffer = Buffer.concat(parts.map((p) => Buffer.from(p.base64, 'base64')));

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=86400',
    });
    res.send(buffer);
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: 'TTS audio synthesis failed' });
  }
});

// Start Server strictly on Port 30001
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✨ ToonHero AI Storybook & Video Movie Server Running!`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log(`📖 Hero Studio: http://localhost:${PORT}`);
  console.log(`🎬 Story Theater: http://localhost:${PORT}/story`);
  console.log(`📜 Family Scroll Portal: http://localhost:${PORT}/scroll`);
  console.log(`=======================================================`);
});
