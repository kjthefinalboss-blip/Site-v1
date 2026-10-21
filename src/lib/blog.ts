export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  destination: string;
  thumbnail: string;
  video_url: string;
  video_id: string;
  source_type: string;
  status: 'draft' | 'published';
  seo_description: string;
  seo_keywords: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export const blogCategories = [
  'Travel Guides',
  'Family Travel',
  'Road Trips',
  'Hidden Gems',
  'Hotel Reviews',
] as const;

export function formatDate(value: string | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${inline(trimmed.slice(3))}</h2>`;
    } else if (trimmed.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${inline(trimmed.slice(4))}</h3>`;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(trimmed.slice(2))}</li>`;
    } else if (trimmed === '') {
      if (inList) { html += '</ul>'; inList = false; }
      html += '';
    } else if (trimmed.startsWith('*') && trimmed.endsWith('*') && trimmed.length > 2) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p class="italic">${inline(trimmed.slice(1, -1))}</p>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${inline(trimmed)}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;

  function inline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }
}
