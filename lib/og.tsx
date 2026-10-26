import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/content/site';
import { OG_SOURCE } from '@/content/preform-images';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const file = (p: string) => readFile(join(process.cwd(), p));

/** Shared Open Graph card: brand row, page title, and the preform lineup render. */
export async function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [sans, mono, lineup] = await Promise.all([
    file('assets/fonts/instrument-sans-500.woff'),
    file('assets/fonts/jetbrains-mono-500.woff'),
    file(`public/images/preforms/${OG_SOURCE.id}.png`),
  ]);
  const lineupSrc = `data:image/png;base64,${lineup.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#F4F4F1',
          color: '#121312',
          fontFamily: 'Instrument Sans',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', padding: '48px 64px 0', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 30,
                border: '2px solid #121312',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 11, height: 11, borderRadius: 11, background: '#121312' }} />
            </div>
            <span style={{ fontSize: 26, letterSpacing: '-0.02em' }}>{site.name}</span>
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: 'JetBrains Mono',
                fontSize: 18,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#5E605C',
              }}
            >
              {eyebrow}
            </span>
          </div>
          <div style={{ fontSize: 68, lineHeight: 1, letterSpacing: '-0.045em', maxWidth: 1000 }}>
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, marginTop: 20, background: '#E7E7E2' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lineupSrc} alt="" width={1200} height={380} style={{ objectFit: 'cover' }} />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Instrument Sans', data: sans, weight: 500, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
      ],
    },
  );
}
