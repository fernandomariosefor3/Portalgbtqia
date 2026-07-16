import fs from 'fs';
import path from 'path';

const agentDir = path.join(process.cwd(), '.agents', 'skills', 'portalgbtqia-product-engineer');
const claudeDir = path.join(process.cwd(), '.claude', 'skills', 'portalgbtqia-product-engineer');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

function compareDirectories() {
  console.log('Verificando sincronia das skills...');
  const agentFiles = getFiles(agentDir).map(f => path.relative(agentDir, f));
  const claudeFiles = getFiles(claudeDir).map(f => path.relative(claudeDir, f));

  const allFiles = new Set([...agentFiles, ...claudeFiles]);
  let hasError = false;

  for (const file of allFiles) {
    const agentFilePath = path.join(agentDir, file);
    const claudeFilePath = path.join(claudeDir, file);

    if (!fs.existsSync(agentFilePath)) {
      console.error(`[ERRO] Arquivo ausente no Antigravity (.agents): ${file}`);
      hasError = true;
      continue;
    }

    if (!fs.existsSync(claudeFilePath)) {
      console.error(`[ERRO] Arquivo ausente no Claude Code (.claude): ${file}`);
      hasError = true;
      continue;
    }

    const agentContent = fs.readFileSync(agentFilePath, 'utf8');
    const claudeContent = fs.readFileSync(claudeFilePath, 'utf8');

    if (agentContent !== claudeContent) {
      console.error(`[ERRO] Conteúdo divergente no arquivo: ${file}`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('\nAs versões da skill estão diferentes! Por favor, sincronize as pastas .agents/skills e .claude/skills.');
    process.exit(1);
  } else {
    console.log('Tudo certo! As skills estão 100% sincronizadas.');
  }
}

compareDirectories();
