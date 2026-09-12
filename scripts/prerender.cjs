const fs = require('fs');
const path = require('path');

// Load the playlist data
const playlistTsPath = path.resolve(__dirname, '../src/data/playlist.ts');
const playlistContent = fs.readFileSync(playlistTsPath, 'utf8');

// Parse JSON data from playlist.ts
const match = playlistContent.match(/export const PLAYLIST: PlaylistData = ([\s\S]*?);\s*$/);
if (!match) {
  console.error('Failed to match PLAYLIST data in playlist.ts');
  process.exit(1);
}

let playlistData;
try {
  const jsonLike = match[1]
    .replace(/(title|description|videos|id|orderIndex|externalLink|thumbnailUrl|category|accentColor|dateAdded):/g, '"$1":');
  playlistData = JSON.parse(jsonLike);
} catch (e) {
  console.error('Error parsing playlist data:', e);
  process.exit(1);
}

const CATEGORIES = [
  'Radio & mixtapes',
  'Travel & transit',
  'Folk & regional',
  'Classical & instrumental',
  'Nostalgia & retro',
  'Devotional & spiritual',
  'Ambient & mood'
];

function getStationSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateSitemap() {
  const baseUrl = 'https://airwaves.dpdns.org';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // 1. Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // 2. All 7 Channel / Category Pages
  CATEGORIES.forEach((cat) => {
    const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/category/${catSlug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  });

  // 3. All 70 Station Permalinks
  playlistData.videos.forEach((video) => {
    const slug = getStationSlug(video.title);
    const lastmod = video.dateAdded ? video.dateAdded.split('T')[0] : today;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/station/${slug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.75</priority>\n`;
    xml += `  </url>\n`;
  });

  // 4. Legal & Info Pages
  const staticPages = [
    { path: '/privacy', priority: '0.4', changefreq: 'monthly' },
    { path: '/terms', priority: '0.4', changefreq: 'monthly' },
  ];

  staticPages.forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

function generateStructuredData() {
  const baseUrl = 'https://airwaves.dpdns.org';
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': '70 Independent Audio & Web Radio Projects',
    'description': 'A curated sequence of independent web radio, ambient soundscapes, highway bus mixtapes, and cultural music projects.',
    'numberOfItems': playlistData.videos.length,
    'itemListElement': playlistData.videos.map((video) => {
      const slug = getStationSlug(video.title);
      return {
        '@type': 'ListItem',
        'position': video.orderIndex,
        'name': video.title,
        'url': `${baseUrl}/station/${slug}`,
        'sameAs': video.externalLink,
        'image': video.thumbnailUrl
      };
    })
  };

  return `<!-- Schema.org ItemList -->
    <script type="application/ld+json">
${JSON.stringify(itemListSchema, null, 2)}
    </script>`;
}

function generatePrerenderedHTML() {
  let categoriesHtml = '';

  CATEGORIES.forEach((cat) => {
    const items = playlistData.videos.filter((v) => v.category === cat);
    if (items.length === 0) return;

    const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let itemsHtml = items.map((video) => {
      const domain = video.externalLink.replace(/^https?:\/\//, '').split('/')[0];
      return `
        <article id="track-${video.id}" class="video-prerender-card" style="display:flex; flex-direction:column; background:#111114; border:1px solid #27272a; border-radius:1rem; overflow:hidden; margin-bottom:1rem;">
          <div style="aspect-ratio:16/9; background:#000; position:relative; overflow:hidden;">
            <img src="${video.thumbnailUrl}" alt="Broadcast artwork for ${video.title} (${video.category})" width="640" height="360" loading="lazy" style="width:100%; height:100%; object-fit:cover;" />
          </div>
          <div style="padding:1rem; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
            <h3 style="color:#fff; font-size:1.125rem; font-weight:600; margin:0 0 0.5rem 0;">
              <a href="${video.externalLink}" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:none;">${video.title}</a>
            </h3>
            <p style="color:#71717a; font-family:monospace; font-size:0.75rem; margin:0;">${domain} ↗</p>
          </div>
        </article>`;
    }).join('\n');

    categoriesHtml += `
      <section id="${catSlug}" class="category-prerender-section" style="margin-bottom:3rem;">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
          <h2 style="font-size:1.5rem; font-weight:700; color:#fff; margin:0;">${cat}</h2>
          <span style="font-family:monospace; font-size:11px; color:#a1a1aa; background:#141418; border:1px solid #27272a; padding:2px 8px; border-radius:9999px;">${items.length} feeds</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1.25rem;">
          ${itemsHtml}
        </div>
      </section>`;
  });

  return `
    <header style="background:#08080a; border-bottom:1px solid #26262a; padding:1rem 1.5rem;">
      <div style="max-width:80rem; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:800; font-size:1.25rem; color:#fff; display:flex; align-items:center; gap:0.5rem;">
          <span style="width:10px; height:10px; border-radius:50%; background:#ef4444; display:inline-block;"></span>
          <span>Airwaves</span>
        </div>
        <span style="font-family:monospace; font-size:0.75rem; color:#a1a1aa; background:#141418; border:1px solid #27272a; padding:0.5rem 0.875rem; border-radius:0.75rem;">70 feeds</span>
      </div>
    </header>

    <section style="background:#08080a; border-bottom:1px solid #26262a; padding:2.5rem 1.5rem;">
      <div style="max-width:80rem; margin:0 auto;">
        <span style="color:#ef4444; font-family:monospace; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Curated soundscapes & web radio</span>
        <h1 style="color:#fff; font-size:2.5rem; font-weight:800; margin:0.75rem 0 1rem 0; line-height:1.15;">Discover 70 independent audio worlds.</h1>
        <p style="color:#a1a1aa; font-size:1rem; max-width:40rem; line-height:1.6; margin:0;">An open collection of ambient web radios, highway bus mixtapes, retro television nostalgia, and cultural music projects.</p>
      </div>
    </section>

    <main style="max-width:80rem; margin:0 auto; padding:2.5rem 1.5rem;">
      ${categoriesHtml}
    </main>

    <footer style="border-top:1px solid #26262a; background:#08080a; color:#a1a1aa; padding:3rem 1.5rem; margin-top:4rem;">
      <div style="max-width:80rem; margin:0 auto;">
        <h4 style="color:#fff; font-size:1rem; margin:0 0 0.5rem 0;">AIRWAVES</h4>
        <p style="font-size:0.875rem; max-width:32rem; line-height:1.5;">A single, human-curated playlist indexing 70 independent audio projects, web radios, highway travel soundscapes, and regional folk music from across India.</p>
        <p style="font-family:monospace; font-size:0.75rem; color:#71717a; margin-top:1rem;">Airwaves · 70 independent audio websites · No algorithms · Zero ads</p>
      </div>
    </footer>
  `.trim();
}

function injectPrerender(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  
  // 1. Inject / Update Structured Data in <head>
  const structuredData = generateStructuredData();
  if (!html.includes('<!-- Schema.org ItemList -->')) {
    html = html.replace('</head>', `    ${structuredData}\n  </head>`);
  }

  // 2. Inject Prerendered HTML into empty <div id="root"></div>
  const prerendered = generatePrerenderedHTML();
  if (html.includes('<div id="root"></div>')) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">\n${prerendered}\n    </div>`
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Successfully injected structured data and prerendered markup into ${path.basename(filePath)}!`);
}

// 1. Generate XML Sitemap with all 70 station permalinks
const sitemapXml = generateSitemap();
const publicSitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
const distSitemapPath = path.resolve(__dirname, '../dist/sitemap.xml');
fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf8');
console.log('Successfully updated public/sitemap.xml with 70 station permalinks!');
if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
  fs.writeFileSync(distSitemapPath, sitemapXml, 'utf8');
  console.log('Successfully updated dist/sitemap.xml with 70 station permalinks!');
}

// 2. Only inject into built production bundle
const distIndexPath = path.resolve(__dirname, '../dist/index.html');
injectPrerender(distIndexPath);

