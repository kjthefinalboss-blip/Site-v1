/*
# Create blog_posts, subscribers, and notification_log tables

## Purpose
Enables an AI-powered travel blog system where:
- New YouTube videos automatically generate draft blog posts via OpenAI
- The site owner reviews, edits, and publishes drafts through a private admin area
- Visitors can subscribe by email and receive notifications for new blog posts, videos, and reels
- A notification log prevents duplicate emails

## New Tables

### blog_posts
Stores AI-generated blog articles with draft/published workflow.
- id (uuid PK)
- slug (text, unique — URL-friendly identifier)
- title, excerpt, content (markdown), category, destination
- thumbnail, video_url, video_id, source_type (youtube/instagram)
- status (draft/published) — drafts are private, published are public
- seo_description, seo_keywords
- created_at, updated_at, published_at

### subscribers
Stores email addresses of visitors who want notifications.
- id (uuid PK)
- email (text, unique)
- confirmed (boolean, default false)
- created_at

### notification_log
Tracks which notifications have been sent to avoid duplicates.
- id (uuid PK)
- subscriber_id (FK to subscribers)
- post_id (FK to blog_posts, nullable)
- content_type (blog/video/reel)
- content_id (text — video ID, reel shortcode, or post ID)
- sent_at
- Unique constraint on (subscriber_id, content_type, content_id)

## Security
- blog_posts: anon can SELECT published posts only; authenticated can do full CRUD on all posts
- subscribers: anon can INSERT (signup); authenticated can SELECT/UPDATE/DELETE (owner manages)
- notification_log: authenticated only for SELECT/INSERT/DELETE
- All tables have RLS enabled
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Travel Guide',
  destination text NOT NULL DEFAULT '',
  thumbnail text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  video_id text NOT NULL DEFAULT '',
  source_type text NOT NULL DEFAULT 'youtube',
  status text NOT NULL DEFAULT 'draft',
  seo_description text NOT NULL DEFAULT '',
  seo_keywords text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_published_posts" ON blog_posts;
CREATE POLICY "anon_select_published_posts" ON blog_posts FOR SELECT
  TO anon USING (status = 'published');

DROP POLICY IF EXISTS "auth_select_all_posts" ON blog_posts;
CREATE POLICY "auth_select_all_posts" ON blog_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_posts" ON blog_posts;
CREATE POLICY "auth_insert_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_posts" ON blog_posts;
CREATE POLICY "auth_update_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_posts" ON blog_posts;
CREATE POLICY "auth_delete_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_video_id ON blog_posts(video_id);

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_subscribers" ON subscribers;
CREATE POLICY "anon_insert_subscribers" ON subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_subscribers" ON subscribers;
CREATE POLICY "auth_select_subscribers" ON subscribers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_subscribers" ON subscribers;
CREATE POLICY "auth_update_subscribers" ON subscribers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_subscribers" ON subscribers;
CREATE POLICY "auth_delete_subscribers" ON subscribers FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid REFERENCES subscribers(id) ON DELETE CASCADE,
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  content_id text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  UNIQUE(subscriber_id, content_type, content_id)
);

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_notifications" ON notification_log;
CREATE POLICY "auth_select_notifications" ON notification_log FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_notifications" ON notification_log;
CREATE POLICY "auth_insert_notifications" ON notification_log FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_notifications" ON notification_log;
CREATE POLICY "auth_delete_notifications" ON notification_log FOR DELETE
  TO authenticated USING (true);