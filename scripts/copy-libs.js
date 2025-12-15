const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
}

function resolveFirst(paths) {
  for (const candidate of paths) {
    try {
      return require.resolve(candidate);
    } catch (err) {
      // continue
    }
  }
  return null;
}

const root = path.resolve(__dirname, '..');
const publicLib = path.join(root, 'public', 'lib');

// Lodash
const lodashSrc = require.resolve('lodash/lodash.min.js');
copyFile(lodashSrc, path.join(publicLib, 'lodash', 'lodash.min.js'));

// Jasmine
const jasmineBase = path.join(path.dirname(require.resolve('jasmine-core/lib/jasmine-core/jasmine.js')), '..');
const jasmineFiles = ['jasmine.js', 'jasmine-html.js', 'jasmine.css', 'boot0.js', 'boot1.js'];
jasmineFiles.forEach(file => {
  copyFile(path.join(jasmineBase, file), path.join(publicLib, 'jasmine-core', file));
});

// Protovis (vendored under vendor/protovis/protovis.js)
const protovisSrc = path.join(root, 'vendor', 'protovis', 'protovis.js');
if (!fs.existsSync(protovisSrc)) {
  throw new Error('Missing vendor/protovis/protovis.js. Restore it or update copy-libs.js with a valid source.');
}
copyFile(protovisSrc, path.join(publicLib, 'protovis', 'protovis.js'));
