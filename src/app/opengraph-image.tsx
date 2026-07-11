import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chohan Space';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background: 'linear-gradient(135deg, #05070B 0%, #111827 100%)',
          color: 'white',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: 32, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
            <span style={{ fontSize: 48 }}>✦</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Chohan Space</div>
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.74)' }}>Premium web experiences for modern brands</div>
          </div>
        </div>
        <div style={{ marginTop: 36, fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em' }}>Design. Build. Launch.</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
