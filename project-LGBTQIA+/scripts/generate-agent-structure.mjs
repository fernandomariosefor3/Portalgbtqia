import fs from 'fs';
import path from 'path';

const dirs = [
  'agent-kit/skills/portalgbtqia-product-engineer/references',
  'agent-kit/skills/portalgbtqia-product-engineer/templates',
  '.agents/skills/portalgbtqia-product-engineer',
  '.claude/skills/portalgbtqia-product-engineer',
  'scripts',
  'docs'
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

const skillContent = `---
name: portalgbtqia-product-engineer
description: Desenvolve, audita e melhora o Portal LGBTQIA+ e a Rede Farol. Use para produto, frontend, backend, artigos, agentes, MCP, serviços, acolhimento, segurança, direitos, saúde, cultura, acessibilidade, SEO, testes, GitHub e Vercel.
---
`;
fs.writeFileSync('agent-kit/skills/portalgbtqia-product-engineer/SKILL.md', skillContent, 'utf8');

const emptyFiles = [
  'agent-kit/skills/portalgbtqia-product-engineer/references/editorial-guidelines.md',
  'agent-kit/skills/portalgbtqia-product-engineer/references/image-policy.md',
  'agent-kit/skills/portalgbtqia-product-engineer/references/technical-checklist.md',
  'agent-kit/skills/portalgbtqia-product-engineer/references/safety-protocols.md',
  'agent-kit/skills/portalgbtqia-product-engineer/templates/audit-report.md',
  'agent-kit/skills/portalgbtqia-product-engineer/templates/handoff-report.md'
];

emptyFiles.forEach(f => {
  fs.writeFileSync(f, '', 'utf8');
});

const syncScriptContent = `import fs from 'fs';
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
`;
fs.writeFileSync('scripts/sync-agent-skills.mjs', syncScriptContent, 'utf8');

const checkScriptContent = `import fs from 'fs';
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
`;
fs.writeFileSync('scripts/check-agent-skills.mjs', checkScriptContent, 'utf8');

const agentsRules = `
## Portal LGBTQIA+ e Rede Farol
* responder ao responsável pelo projeto em português brasileiro claro;
* ler os documentos da pasta docs antes de mudanças estruturais;
* não inventar dados, serviços, oportunidades, fontes ou resultados;
* não expor segredos;
* não fazer push, merge ou deploy sem autorização;
* não alterar diretamente a branch main;
* não apresentar protótipos como funcionalidades reais;
* validar lint, testes e build antes de declarar conclusão;
* registrar cada entrega no arquivo de passagem;
* priorizar privacidade, acessibilidade, segurança e dignidade da comunidade;
* preservar mudanças feitas por outro agente;
* não trabalhar em arquivos que estejam sendo modificados por outra ferramenta.

## Política de Branches
* main recebe somente versões aprovadas;
* develop integra funcionalidades em desenvolvimento;
* Antigravity usa branches antigravity/<tarefa>;
* Claude Code usa branches claude/<tarefa>;
* nenhum agente deve fazer merge sozinho;
* cada tarefa deve possuir objetivo e arquivos claramente definidos.

## Agentes Futuros
* Farol Orquestrador
* Acolher
* Direitos
* Cuidado
* Proteção
* Viver
* Oportunidades
* Verificador
* LibrasVox
`;

if (fs.existsSync('AGENTS.md')) {
  fs.appendFileSync('AGENTS.md', agentsRules, 'utf8');
} else {
  fs.writeFileSync('AGENTS.md', '# Regras do Google Antigravity\\n' + agentsRules, 'utf8');
}

if (fs.existsSync('CLAUDE.md')) {
  fs.appendFileSync('CLAUDE.md', agentsRules, 'utf8');
} else {
  fs.writeFileSync('CLAUDE.md', '# Regras do Claude Code\\n' + agentsRules, 'utf8');
}
