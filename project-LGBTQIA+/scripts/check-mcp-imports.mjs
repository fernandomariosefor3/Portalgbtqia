import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FORBIDDEN_MODULES = [
  'firebase',
  'firebase-admin',
  'react',
  'child_process',
  'undici',
  'axios',
  'node:http',
  'node:https',
  'node:net',
  'node:tls',
];

const FORBIDDEN_PATHS = [
  'src/mocks',
  'legacyAdapters',
  'fixtures',
];

const MCP_DIR = path.resolve(__dirname, '../mcp/portal-lgbtqia-knowledge-mcp');
const TESTS_DIR = path.join(MCP_DIR, 'tests');

function checkFile(filePath) {
  if (filePath.startsWith(TESTS_DIR) || filePath.endsWith('.test.ts')) {
    return true; // We don't check test files for these strict rules
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  let hasErrors = false;

  function checkModuleString(moduleName, node) {
    if (FORBIDDEN_MODULES.includes(moduleName)) {
      console.error(`[ERR] Forbidden module "${moduleName}" imported at ${filePath}`);
      hasErrors = true;
    }
    
    for (const p of FORBIDDEN_PATHS) {
      if (moduleName.includes(p)) {
        console.error(`[ERR] Forbidden path "${p}" imported at ${filePath}`);
        hasErrors = true;
      }
    }
  }

  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        checkModuleString(node.moduleSpecifier.text, node);
      }
    }
    
    if (ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        checkModuleString(node.moduleSpecifier.text, node);
      }
    }

    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const arg = node.arguments[0];
      if (arg && ts.isStringLiteral(arg)) {
        checkModuleString(arg.text, node);
      }
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require') {
      const arg = node.arguments[0];
      if (arg && ts.isStringLiteral(arg)) {
        checkModuleString(arg.text, node);
      }
    }

    if (ts.isIdentifier(node)) {
      const text = node.text;
      if (['fetch', 'XMLHttpRequest', 'WebSocket'].includes(text)) {
        console.error(`[ERR] Forbidden global API "${text}" used at ${filePath}`);
        hasErrors = true;
      }
    }

    if (ts.isPropertyAccessExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === 'process' && node.name.text === 'env') {
         console.error(`[ERR] Forbidden "process.env" usage at ${filePath}`);
         hasErrors = true;
      }
    }

    if (ts.isPropertyAccessExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === 'console' && node.name.text === 'log') {
         console.error(`[ERR] Forbidden "console.log" usage at ${filePath}`);
         hasErrors = true;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return !hasErrors;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let allPass = true;
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!walkDir(full)) allPass = false;
    } else if (full.endsWith('.ts') || full.endsWith('.js')) {
      if (!checkFile(full)) allPass = false;
    }
  }
  return allPass;
}

const success = walkDir(MCP_DIR);
if (!success) {
  process.exit(1);
} else {
  console.log("No forbidden imports or usages found in MCP production code.");
}
