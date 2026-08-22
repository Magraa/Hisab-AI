// Renders a tiny synchronous script that applies the saved theme to <html>
// before first paint, so switching themes doesn't flash the default theme
// on reload. No hooks/interactivity here, so this stays a Server Component.
const BOOTSTRAP = `
(function () {
  try {
    var t = localStorage.getItem("hisab_theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />;
}
