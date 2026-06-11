-- Create page_views table to track views per route
CREATE TABLE IF NOT EXISTS page_views (
  path TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Create certificate_clicks table to track clicks per certificate
CREATE TABLE IF NOT EXISTS certificate_clicks (
  cert_id TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Create messages_count table to track total number of messages sent
CREATE TABLE IF NOT EXISTS messages_count (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER DEFAULT 0
);

-- Initialize the messages counter row
INSERT INTO messages_count (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
