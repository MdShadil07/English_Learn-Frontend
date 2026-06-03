/**
 * PageSkeleton — Ultra-lightweight fallback shown while JS chunks load.
 * Zero external dependencies. Pure CSS animation. Works before any fonts load.
 */
const PageSkeleton = () => (
  <div
    role="status"
    aria-label="Loading page…"
    style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f8fbff 0%, #f0f9ff 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Navbar skeleton */}
    <div
      style={{
        height: 64,
        width: '100%',
        background: 'rgba(255,255,255,0.92)',
        borderBottom: '1px solid rgba(226,232,240,0.5)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 12,
      }}
    >
      <div style={pulse({ width: 40, height: 40, borderRadius: 8 })} />
      <div style={pulse({ width: 140, height: 20, borderRadius: 8 })} />
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
        <div style={pulse({ width: 60, height: 32, borderRadius: 20 })} />
        <div style={pulse({ width: 90, height: 32, borderRadius: 20 })} />
      </div>
    </div>

    {/* Hero skeleton */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        gap: 20,
      }}
    >
      <div style={pulse({ width: 180, height: 24, borderRadius: 20 })} />
      <div style={pulse({ width: 320, height: 48, borderRadius: 12 })} />
      <div style={pulse({ width: 260, height: 48, borderRadius: 12 })} />
      <div style={pulse({ width: 240, height: 20, borderRadius: 8 })} />
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <div style={pulse({ width: 140, height: 48, borderRadius: 28 })} />
        <div style={pulse({ width: 120, height: 48, borderRadius: 28 })} />
      </div>
    </div>

    <style>{`
      @keyframes _skeleton_pulse {
        0%, 100% { opacity: 0.5; }
        50%       { opacity: 1; }
      }
    `}</style>
  </div>
);

/** Returns inline style object for a pulsing skeleton block */
function pulse(size: React.CSSProperties): React.CSSProperties {
  return {
    ...size,
    background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
    backgroundSize: '200% 100%',
    animation: '_skeleton_pulse 1.4s ease-in-out infinite',
    flexShrink: 0,
  };
}

export default PageSkeleton;
