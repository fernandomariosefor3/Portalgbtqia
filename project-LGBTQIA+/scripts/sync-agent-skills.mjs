import fs from 'fs';
import path from 'path';

const srcDir = 'agent-kit/skills/portalgbtqia-product-engineer';
const destAntigravity = '.agents/skills/portalgbtqia-product-engineer';
const destClaude = '.claude/skills/portalgbtqia-product-engineer';

function copyDirRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Sincronizando skills...');
  copyDirRecursiveSync(srcDir, destAntigravity);
  copyDirRecursiveSync(srcDir, destClaude);
  console.log('Sincronização concluída com sucesso!');
} catch (e) {
  console.error('Erro na sincronização:', e);
  process.exit(1);
}
