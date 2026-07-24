// Fixed top gap regardless of what precedes it on a given page — every page
// is expected to leave its own trailing element's bottom margin at 0 so
// this is the sole source of spacing above the footer everywhere. It
// matches the standard 28px section-to-section gap used throughout the app
// (e.g. between the agenda/stations/passport blocks). No bottom margin of
// its own — each page's own bottom padding on <main> (28px, matching this
// same value) provides the space below, so the gap above and below the
// footer text ends up equal.
export function Footer() {
  return (
    <p style={{ fontSize: 13, fontWeight: 600, color: "#999", textAlign: "center", marginTop: 28, marginBottom: 0 }}>
      Developed by <a href="https://www.linkedin.com/in/mongchanrattnak/" target="_blank" rel="noopener noreferrer" style={{ color: "#767676", fontWeight: 700, textDecoration: "underline" }}>Chanrattnak Mong</a>
    </p>
  );
}
