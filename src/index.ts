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
  try {
    console.error("Starting MCP server...");
    
    // Create a new server instance
    const server = new Server(
      {
        name: SERVER_CONFIG.name,
        version: SERVER_CONFIG.version
      },
      {
        capabilities: SERVER_CONFIG.capabilities
      }
    );
    
    // Configure MCP capabilities
    configureResources(server);
    configureTools(server);
    configurePrompts(server);
    
    // Create and connect transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error(`MCP server "${SERVER_CONFIG.name}" v${SERVER_CONFIG.version} started`);
    console.error("Listening for requests via stdio...");
    
    // Keep process running until connection closes
    transport.onclose = () => {
      console.error("Transport closed");
      process.exit(0);
    };
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
}); 