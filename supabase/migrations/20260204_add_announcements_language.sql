-- Migration: Add language to announcements and mark Polish content
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE announcements
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Keep updated_at fresh on edits
CREATE OR REPLACE FUNCTION set_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_announcements_updated_at ON announcements;
CREATE TRIGGER tr_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION set_announcements_updated_at();

-- Mark likely Polish announcements based on diacritics in title or message
UPDATE announcements
SET language = 'pl'
WHERE (title ~ '[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]')
   OR (message ~ '[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]');
