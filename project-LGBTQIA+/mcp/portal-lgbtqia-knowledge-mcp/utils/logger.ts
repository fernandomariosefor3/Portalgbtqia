export interface McpLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string, error?: unknown): void;
}

export const mcpLogger: McpLogger = {
  info(message: string) {
    process.stderr.write(`[INFO] ${message}\n`);
  },
  warn(message: string) {
    process.stderr.write(`[WARN] ${message}\n`);
  },
  error(message: string, error?: unknown) {
    let errStr = '';
    // Prevent stack traces from leaking directly into stderr unless strictly controlled, 
    // but in this MCP we avoid full stack traces even in stderr to be safe.
    if (error instanceof Error) {
      errStr = ` - ${error.name}: ${error.message}`;
    } else if (error !== undefined) {
      errStr = ` - ${String(error)}`;
    }
    process.stderr.write(`[ERROR] ${message}${errStr}\n`);
  }
};
