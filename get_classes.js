const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const files = walkSync('./app').filter(f => f.endsWith('.tsx'));
const classes = new Set();
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/className="([^"]+)"/g);
  if (matches) {
    matches.forEach(m => {
      m.replace('className="', '').replace('"', '').split(' ').forEach(c => {
        if (c.trim()) classes.add(c.trim());
      });
    });
  }
});

console.log(Array.from(classes).sort().join('\n'));
