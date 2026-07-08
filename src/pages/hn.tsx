import Head from 'next/head';
import { SkillsChooser } from '@/components/skills-chooser';

// Hidden, unindexed embed of just the Skills demo (chooser + looping video), meant to
// be linked directly from a Hacker News post. No marketing chrome. Defaults to the
// Hacker News clip; ?skill=jira|spotify|hackernews deep-links to any of the three.
export default function HnDemoPage() {
  return (
    <>
      <Head>
        <title>Frigade Assistant demo</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        style={{
          minHeight: '100vh',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          padding: '48px 20px',
          fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ width: '100%', maxWidth: 900 }}>
          <SkillsChooser defaultSkill="hackernews" allowFullscreen />
        </div>
        <a
          href="https://frigade.com?utm_source=hn-demo&utm_medium=powered-by&utm_campaign=frigade-assistant"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 500, color: '#9aa0b0', textDecoration: 'none' }}
        >
          Powered by
          <img src="/images/frigade-logo.svg" alt="Frigade" style={{ height: 15, width: 'auto', display: 'block', opacity: 0.85 }} />
        </a>
      </main>
    </>
  );
}
