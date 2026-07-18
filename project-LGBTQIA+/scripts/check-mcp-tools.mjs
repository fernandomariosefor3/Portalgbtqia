import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_FILE = path.resolve(__dirname, '../mcp/portal-lgbtqia-knowledge-mcp/server.ts');

const ALLOWLIST = [
  'check_information_freshness',
  'get_validated_content',
  'get_verified_service',
  'search_validated_content',
  'search_verified_services',
  'search_verified_sources'
].sort();

const FORBIDDEN_VERBS = [
  'create', 'update', 'delete', 'write', 'publish', 'validate', 'approve', 'submit', 'set_partner', 'mark_verified', 'send_emergency', 'store_conversation'
];

function checkTools() {
  const content = fs.readFileSync(SERVER_FILE, 'utf-8');
  const sourceFile = ts.createSourceFile(
    SERVER_FILE,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const registeredTools = [];
  let hasErrors = false;

  function visit(node) {
    if (ts.isCallExpression(node)) {
      if (ts.isPropertyAccessExpression(node.expression)) {
        if (node.expression.name.text === 'tool') {
          // server.tool('nome', ...)
          const arg = node.arguments[0];
          if (arg && ts.isStringLiteral(arg)) {
            const toolName = arg.text;
            registeredTools.push(toolName);
            
            // Verificação de verbos proibidos
            for (const verb of FORBIDDEN_VERBS) {
              if (toolName.startsWith(verb + '_') || toolName === verb) {
                console.error(`[ERR] Tool "${toolName}" contains forbidden verb "${verb}"`);
                hasErrors = true;
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  registeredTools.sort();

  if (registeredTools.length !== ALLOWLIST.length) {
    console.error(`[ERR] Expected ${ALLOWLIST.length} tools, but found ${registeredTools.length}`);
    hasErrors = true;
  }

  for (let i = 0; i < Math.max(registeredTools.length, ALLOWLIST.length); i++) {
    if (registeredTools[i] !== ALLOWLIST[i]) {
      console.error(`[ERR] Tool mismatch: expected "${ALLOWLIST[i]}", found "${registeredTools[i]}"`);
      hasErrors = true;
    }
  }

  const uniqueTools = new Set(registeredTools);
  if (uniqueTools.size !== registeredTools.length) {
    console.error(`[ERR] Duplicate tools found in registration`);
    hasErrors = true;
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log(`Successfully verified exact ${ALLOWLIST.length} allowlisted read-only tools.`);
  }
}

checkTools();
