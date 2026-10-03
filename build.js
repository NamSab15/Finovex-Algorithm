/* Build: copy public/ → dist/, minifying HTML, CSS and JS */
const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');

const SRC = path.join(__dirname, 'public');
const OUT = path.join(__dirname, 'dist');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

async function transform(file, code) {
  switch (path.extname(file)) {
    case '.html':
      return minifyHtml(stamp(code), {
        collapseWhitespace: true, conservativeCollapse: true, removeComments: true,
        minifyCSS: true, minifyJS: true, removeRedundantAttributes: true, useShortDoctype: true
      });
    case '.css': {
      const r = new CleanCSS({ level: 2 }).minify(code);
      if (r.errors.length) throw new Error(r.errors.join('\n'));
      return r.styles;
    }
    case '.js':
      return (await minifyJs(code, { compress: true, mangle: true })).code;
    default:
      return null;
  }
}

/* stamp asset URLs with a content hash so browsers never pair new HTML with a cached old script */
const hashOf = f => require('crypto').createHash('md5').update(fs.readFileSync(path.join(SRC, f))).digest('hex').slice(0, 10);
const VERSIONS = { '/css/style.css': hashOf('css/style.css'), '/js/main.js': hashOf('js/main.js') };
const stamp = html => html.replace(/(\/css\/style\.css|\/js\/main\.js)(\?v=[\w-]+)?/g, (_, url) => `${url}?v=${VERSIONS[url]}`);

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  let before = 0, after = 0;
  for (const file of walk(SRC)) {
    const dest = path.join(OUT, path.relative(SRC, file));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const buf = fs.readFileSync(file);
    const out = await transform(file, buf.toString('utf8'));
    if (out == null) { fs.copyFileSync(file, dest); continue; }
    fs.writeFileSync(dest, out);
    before += buf.length; after += Buffer.byteLength(out);
  }
  console.log(`Built dist/ · ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB`);
})().catch(e => { console.error(e); process.exit(1); });
