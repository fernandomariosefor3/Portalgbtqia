import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const srcDir = 'agent-kit/skills/portalgbtqia-product-engineer';
const destAntigravity = '.agents/skills/portalgbtqia-product-engineer';
const destClaude = '.claude/skills/portalgbtqia-product-engineer';

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function checkDirMatch(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (!fs.existsSync(destPath)) {
      throw new Error("Arquivo/Diretório ausente no destino: " + destPath);
    }

    if (entry.isDirectory()) {
      checkDirMatch(srcPath, destPath);
    } else {
      const hashSrc = getFileHash(srcPath);
      const hashDest = getFileHash(destPath);
      if (hashSrc !== hashDest) {
        throw new Error("Divergência detectada no arquivo: " + destPath);
      }
    }
  }
}

try {
  console.log('Verificando integridade das skills...');
  checkDirMatch(srcDir, destAntigravity);
  checkDirMatch(srcDir, destClaude);
  console.log('Verificação concluída: Todas as skills estão idênticas!');
} catch (e) {
  console.error('ERRO: As skills não estão sincronizadas.');
  console.error(e.message);
  process.exit(1);
}
