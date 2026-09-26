CREATE TABLE Category (
  id TEXT PRIMARY KEY NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE Profile (
  id TEXT PRIMARY KEY NOT NULL,
  telegramId TEXT NOT NULL UNIQUE,
  firstName TEXT NOT NULL,
  lastName TEXT,
  username TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  createdAt TEXT NOT NULL,
  updatetAd TEXT NOT NULL
);
CREATE TABLE TelegramPost (
  id TEXT PRIMARY KEY NOT NULL,
  text TEXT NOT NULL,
  date TEXT NOT NULL,
  postLink TEXT NOT NULL,
  isHidden INTEGER NOT NULL DEFAULT 0 CHECK (isHidden IN (0, 1)),
  postId TEXT
);
CREATE TABLE Post (
  id TEXT PRIMARY KEY NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  title TEXT NOT NULL,
  categoryId TEXT NOT NULL REFERENCES Category(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  price TEXT NOT NULL,
  mapUrl TEXT NOT NULL,
  telegramPostId TEXT NOT NULL UNIQUE REFERENCES TelegramPost(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE Image (
  id TEXT PRIMARY KEY NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  telegramPostId TEXT REFERENCES TelegramPost(id) ON DELETE CASCADE ON UPDATE CASCADE,
  path TEXT NOT NULL UNIQUE,
  altText TEXT,
  mainImage INTEGER NOT NULL DEFAULT 0 CHECK (mainImage IN (0, 1))
);
CREATE INDEX Post_categoryId_idx ON Post(categoryId);
CREATE INDEX TelegramPost_date_idx ON TelegramPost(date DESC);
CREATE INDEX Image_telegramPostId_idx ON Image(telegramPostId, mainImage DESC);
