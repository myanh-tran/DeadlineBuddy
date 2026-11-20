const fs = require('fs');
const path = require('path');
const dest = path.join(__dirname, 'www');
fs.mkdirSync(dest, { recursive: true });
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(dest, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(dest, 'styles.css'));
for (const file of ['app.js', 'atelier.js', 'atelier-lib.js', 'sw.js', 'manifest.json', 'pomo-bell.mp3']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(dest, file));
}
