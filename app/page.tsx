export default function Home() {
  return (
    <main className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <section
        style={{
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Hemp’in Directory</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 16 }}>
          Explore hemp fashion & materials brands, or sign in to manage the directory.
        </p>

        <div className="row" style={{ justifyContent: 'center' }}>
          <a href="/directory" className="btn btn--primary">Browse Directory</a>
          <a href="/login" className="btn">Admin Login</a>
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: '24px auto 0', textAlign: 'center', color: 'var(--muted)' }}>
        <small>
          Tip: If you’re an admin, log in with your email to receive a magic link or 6‑digit code.
        </small>
      </section>
    </main>
  );
}
