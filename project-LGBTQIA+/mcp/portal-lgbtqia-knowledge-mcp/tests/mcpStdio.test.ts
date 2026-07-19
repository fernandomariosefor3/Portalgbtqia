import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SERVER_PATH = join(__dirname, '../index.ts');

describe('MCP Server Stdio Transport', () => {
  it('should list exact 6 tools when requested via JSON-RPC', async () => {
    const { createRequire } = await import('module');
    const req = createRequire(import.meta.url);
    const tsxPath = req.resolve('tsx/cli');
    
    // Run the server using tsx directly via node
    const child = spawn(process.execPath, [tsxPath, SERVER_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' }
    });

    let stderrOutput = '';
    child.stderr?.on('data', (data) => {
      stderrOutput += data.toString();
    });

    const resultPromise = new Promise<string>((resolve, reject) => {
      let stdoutBuffer = '';
      child.stdout?.on('data', (data) => {
        stdoutBuffer += data.toString();
        
        // Split by newline to get complete JSON-RPC messages
        const messages = stdoutBuffer.split('\n');
        
        for (let i = 0; i < messages.length - 1; i++) {
          const msgStr = messages[i].trim();
          if (!msgStr) continue;
          try {
            const msg = JSON.parse(msgStr);
            if (msg.id === 1 && msg.result) {
              resolve(msgStr);
            }
          } catch (e) {
            reject(new Error(`Invalid JSON in stdout: ${msgStr}`));
          }
        }
        stdoutBuffer = messages[messages.length - 1];
      });

      child.on('error', reject);
      child.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });

    // We must send the initialization JSON-RPC
    const initMessage = JSON.stringify({
      jsonrpc: '2.0',
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    }) + '\n';
    
    child.stdin?.write(initMessage);

    // Wait a bit and then send tools/list
    await new Promise(r => setTimeout(r, 200));

    const listToolsMessage = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    }) + '\n';
    
    child.stdin?.write(listToolsMessage);

    const responseStr = await resultPromise;
    const response = JSON.parse(responseStr);

    expect(response.result.tools).toBeDefined();
    expect(response.result.tools.length).toBe(6);
    
    const toolNames = response.result.tools.map((t: any) => t.name).sort();
    expect(toolNames).toEqual([
      'check_information_freshness',
      'get_validated_content',
      'get_verified_service',
      'search_validated_content',
      'search_verified_services',
      'search_verified_sources'
    ]);

    // Cleanup: close stdin to trigger graceful shutdown
    child.stdin?.end();

    const exitCode = await new Promise<number | null>((resolve) => {
      child.on('exit', resolve);
    });

    expect(exitCode).toBe(0);
    expect(stderrOutput).toContain('Portal LGBTQIA+ Knowledge MCP Server is running');
    expect(stderrOutput).toContain('Shutting down MCP server. Reason: stdin closed');
  });
});
