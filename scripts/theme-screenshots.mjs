import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { argv } from 'node:process';

const BASE = process.env.DEMO_URL ?? 'http://localhost:3001';
const OUT = process.env.OUT_DIR ?? '/tmp/theme-screenshots';
const requestedThemes = argv.slice(2).filter(a => !a.startsWith('--'));
const THEMES = requestedThemes.length ? requestedThemes : ['spotify', 'linear', 'vaporwave'];

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/checklists', name: 'checklists' },
  { path: '/forms', name: 'forms' },
  { path: '/tours', name: 'tours' },
  { path: '/cards', name: 'cards' },
  { path: '/hints', name: 'hints' },
  { path: '/modals', name: 'modals' },
];

const MODAL_BUTTONS = ['Modal', 'Styled Modal', 'Custom Modal', 'User Feedback', 'NPS Survey'];

async function setTheme(page, theme) {
  await page.evaluateOnNewDocument(t => {
    try { localStorage.setItem('theme', t); } catch {}
  }, theme);
}

async function settle(page, ms = 1500) {
  await new Promise(r => setTimeout(r, ms));
}

async function shoot(page, file) {
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  → ${file}`);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox'],
  });

  for (const theme of THEMES) {
    const dir = `${OUT}/${theme}`;
    mkdirSync(dir, { recursive: true });
    console.log(`\n== ${theme} ==`);

    const page = await browser.newPage();
    await setTheme(page, theme);

    for (const { path, name } of PAGES) {
      try {
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0', timeout: 20000 });
      } catch (e) {
        console.log(`  ! ${path} navigation: ${e.message}`);
      }
      await settle(page, 2000);
      await shoot(page, `${dir}/${name}.png`);

      if (name === 'modals') {
        for (const label of MODAL_BUTTONS) {
          // Re-navigate so each modal opens cleanly
          await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' });
          await settle(page, 1500);
          const clicked = await page.evaluate(text => {
            const btn = [...document.querySelectorAll('button')]
              .find(b => b.textContent?.trim() === text);
            if (btn) { btn.click(); return true; }
            return false;
          }, label);
          if (!clicked) { console.log(`  ! could not find button ${label}`); continue; }
          await settle(page, 1200);
          await shoot(page, `${dir}/modal-${label.toLowerCase().replace(/\s+/g, '-')}.png`);
        }
      }
    }
    await page.close();
  }

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
