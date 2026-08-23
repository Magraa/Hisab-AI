import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Read merchants list by parsing merchants.ts
const merchantsFile = fs.readFileSync(path.resolve(process.cwd(), "src", "lib", "merchants.ts"), "utf8");

// Regex match all createMerchant(...) calls
const merchantRegex = /createMerchant\(\s*"([^"]+)",\s*"([^"]+)",\s*\[([^\]]+)\],\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"(?:,\s*"([^"]+)")?\s*\)/g;

const MERCHANTS = [];
let match;
while ((match = merchantRegex.exec(merchantsFile)) !== null) {
  MERCHANTS.push({
    id: match[1],
    name: match[2],
    domain: match[5],
    brandColor: match[6],
    relationship: match[7] || "Service",
  });
}

console.log(`Parsed ${MERCHANTS.length} merchants from merchants.ts`);

const targetDirs = [
  path.resolve(process.cwd(), "public", "Assets", "merchants"),
  path.resolve(process.cwd(), "..", "public", "Assets", "merchants"),
];

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function fetchBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return null;
    return buf;
  } catch {
    return null;
  }
}

function generateSvgFallback(name, brandColor) {
  const cleanName = name.trim();
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return `
    <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="${brandColor || '#3B82F6'}"/>
      <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="50" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>
  `;
}

async function downloadAndProcess(merchant) {
  const { id, name, domain, brandColor } = merchant;
  const primaryDest = path.join(targetDirs[0], `${id}.webp`);
  
  // Skip if already exists and is valid size
  if (fs.existsSync(primaryDest) && fs.statSync(primaryDest).size > 200) {
    // ensure secondary dir has it
    if (targetDirs[1] && !fs.existsSync(path.join(targetDirs[1], `${id}.webp`))) {
      fs.copyFileSync(primaryDest, path.join(targetDirs[1], `${id}.webp`));
    }
    return;
  }

  const urls = [
    `https://logo.clearbit.com/${domain}`,
    `https://unavatar.io/${domain}?fallback=false`,
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAV&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];

  let rawBuf = null;
  for (const url of urls) {
    rawBuf = await fetchBuffer(url);
    if (rawBuf) break;
  }

  let webpBuf = null;
  if (rawBuf) {
    try {
      webpBuf = await sharp(rawBuf)
        .resize(128, 128, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .webp({ quality: 88 })
        .toBuffer();
    } catch {
      webpBuf = null;
    }
  }

  if (!webpBuf) {
    const svg = generateSvgFallback(name, brandColor);
    webpBuf = await sharp(Buffer.from(svg))
      .resize(128, 128)
      .webp({ quality: 90 })
      .toBuffer();
  }

  for (const dir of targetDirs) {
    const dest = path.join(dir, `${id}.webp`);
    fs.writeFileSync(dest, webpBuf);
  }

  console.log(`✓ Processed logo for: ${name} (${id}.webp)`);
}

async function run() {
  console.log(`Starting logo optimization for ${MERCHANTS.length} merchants...`);
  const queue = [...MERCHANTS];
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) {
        await downloadAndProcess(item);
      }
    }
  });

  await Promise.all(workers);
  console.log(`All ${MERCHANTS.length} merchant logos successfully downloaded & optimized to WebP!`);
}

run();
