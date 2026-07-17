const fs = require('fs');
const path = require('path');

const mocksDir = path.join(process.cwd(), 'src', 'mocks');
const files = fs.readdirSync(mocksDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(mocksDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const updated = content.replace(/https:\/\/readdy\.ai\/api\/search-image[^'"\s]+/g, '');
  
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`Updated ${file}`);
  }
});

const libsDir = path.join(process.cwd(), 'src', 'lib');
const libFiles = fs.readdirSync(libsDir).filter(f => f.endsWith('.ts'));

libFiles.forEach(file => {
  const filePath = path.join(libsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const updated = content.replace(/https:\/\/readdy\.ai\/api\/search-image[^'"\s]+/g, '');
  
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`Updated lib/${file}`);
  }
});
