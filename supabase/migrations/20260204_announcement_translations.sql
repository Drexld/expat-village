-- Migration: Announcement translations + English view

ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE announcements
SET updated_at = created_at
WHERE updated_at IS NULL;


CREATE TABLE IF NOT EXISTS announcement_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE NOT NULL,
  language VARCHAR(5) NOT NULL,
  title TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (announcement_id, language)
);

ALTER TABLE announcement_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read announcement translations" ON announcement_translations;
DROP POLICY IF EXISTS "Admins can manage announcement translations" ON announcement_translations;

CREATE POLICY "Anyone can read announcement translations" ON announcement_translations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage announcement translations" ON announcement_translations
  FOR ALL USING (is_admin());

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION set_announcement_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_announcement_translations_updated_at ON announcement_translations;
CREATE TRIGGER tr_announcement_translations_updated_at
  BEFORE UPDATE ON announcement_translations
  FOR EACH ROW EXECUTE FUNCTION set_announcement_translations_updated_at();

-- View for English announcements with fallback
CREATE OR REPLACE VIEW announcements_en AS
SELECT
  a.id,
  a.title AS source_title,
  a.message AS source_message,
  COALESCE(t.title, a.title) AS title,
  COALESCE(t.message, a.message) AS message,
  a.type,
  a.priority,
  a.active,
  a.scope,
  a.target_audience,
  a.link_url,
  a.link_text,
  a.category,
  a.language AS source_language,
  a.created_at,
  a.updated_at
FROM announcements a
LEFT JOIN announcement_translations t
  ON t.announcement_id = a.id
 AND t.language = 'en';


