import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SERVER_PATH = join(__dirname, '../index.ts');

describe('Fatal Error Handling Tests', () => {
  it('should shut down gracefully on uncaughtException and exit with code 1', async () => {
    // Create a temporary script that imports index.ts and then throws an error
    const tempScript = join(__dirname, 'temp_crash.ts');
    
    // The script imports index.ts which starts the server, then throws after 500ms
    const scriptContent = `
      import '../index.js';
      setTimeout(() => {
        throw new Error('INTENTIONAL_CRASH_TEST');
      }, 500);
    `;
    
    fs.writeFileSync(tempScript, scriptContent);

    const { createRequire } = await import('module');
    const req = createRequire(import.meta.url);
    const tsxPath = req.resolve('tsx/cli');

    const child = spawn(process.execPath, [tsxPath, tempScript], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' }
    });

    let stderrOutput = '';
    child.stderr?.on('data', (data) => {
      stderrOutput += data.toString();
    });

    const exitCode = await new Promise<number | null>((resolve) => {
      child.on('exit', resolve);
    });

    // Cleanup
    fs.unlinkSync(tempScript);

    expect(exitCode).toBe(1);
    expect(stderrOutput).toContain('[ERROR] Fatal error: uncaughtException');
    // Ensure it does not dump huge unhandled promise stack trace to stdout
    expect(stderrOutput).toContain('INTENTIONAL_CRASH_TEST');
    expect(stderrOutput).toContain('Shutting down MCP server. Reason: uncaughtException');
  }, 15000);

  it('should shut down gracefully on unhandledRejection and exit with code 1', async () => {
    const tempScript = join(__dirname, 'temp_crash2.ts');
    
    const scriptContent = `
      import '../index.js';
      setTimeout(() => {
        Promise.reject(new Error('INTENTIONAL_REJECTION_TEST'));
      }, 500);
    `;
    
    fs.writeFileSync(tempScript, scriptContent);

    const { createRequire } = await import('module');
    const req = createRequire(import.meta.url);
    const tsxPath = req.resolve('tsx/cli');

    const child = spawn(process.execPath, [tsxPath, tempScript], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' }
    });

    let stderrOutput = '';
    child.stderr?.on('data', (data) => {
      stderrOutput += data.toString();
    });

    const exitCode = await new Promise<number | null>((resolve) => {
      child.on('exit', resolve);
    });

    fs.unlinkSync(tempScript);

    expect(exitCode).toBe(1);
    expect(stderrOutput).toContain('[ERROR] Fatal error: unhandledRejection');
    expect(stderrOutput).toContain('INTENTIONAL_REJECTION_TEST');
    expect(stderrOutput).toContain('Shutting down MCP server. Reason: unhandledRejection');
  }, 15000);
});
