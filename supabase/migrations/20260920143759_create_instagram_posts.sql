/*
# Create instagram_posts table (single-tenant, no auth)

1. New Tables
- `instagram_posts`
  - `id` (uuid, primary key)
  - `shortcode` (text, unique — the Instagram post shortcode from the URL, e.g. "CxYz123")
  - `caption` (text — short caption or title for the post)
  - `image_url` (text — URL to the thumbnail/preview image)
  - `post_url` (text — full URL to the Instagram post)
  - `likes` (text — display string like "1.2K")
  - `sort_order` (int, default 0 — lower appears first)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `instagram_posts`.
- Allow anon + authenticated full CRUD because the data is intentionally public/shared (single-tenant, no sign-in).

3. Important Notes
- This table stores curated Instagram posts that the site owner adds manually.
- Each row represents one Instagram post shown in the gallery grid.
- The `shortcode` is extracted from an Instagram post URL (e.g. instagram.com/p/SHORTCODE/).
- The `post_url` is the full link visitors are sent to when they click a tile.
*/

CREATE TABLE IF NOT EXISTS instagram_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortcode text UNIQUE NOT NULL,
  caption text NOT NULL,
  image_url text NOT NULL,
  post_url text NOT NULL,
  likes text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_instagram_posts" ON instagram_posts;
CREATE POLICY "anon_select_instagram_posts" ON instagram_posts FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_instagram_posts" ON instagram_posts;
CREATE POLICY "anon_insert_instagram_posts" ON instagram_posts FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_instagram_posts" ON instagram_posts;
CREATE POLICY "anon_update_instagram_posts" ON instagram_posts FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_instagram_posts" ON instagram_posts;
CREATE POLICY "anon_delete_instagram_posts" ON instagram_posts FOR DELETE
TO anon, authenticated USING (true);
