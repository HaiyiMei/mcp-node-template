import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_CONFIG } from "./config.js";
import { configureResources } from "./resources/index.js";
import { configureTools } from "./tools/index.js";
import { configurePrompts } from "./prompts/index.js";

/**
 * Main function to start the MCP server
 */
async function main() {
  // Create a new server instance
  const server = new Server(
    {
      name: SERVER_CONFIG.name,
      version: SERVER_CONFIG.version,
    },
    {
      capabilities: SERVER_CONFIG.capabilities,
    }
  );

  // Configure MCP capabilities
  configureResources(server);
  configureTools(server);
  configurePrompts(server);

  // Create and connect transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Keep process running until connection closes
  transport.onclose = () => {
    server.close();
    process.exit(0);
  };
}

// Start the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
