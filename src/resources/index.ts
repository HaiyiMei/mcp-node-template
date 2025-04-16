import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  ListResourcesRequestSchema, 
  ReadResourceRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Example resources to expose through the MCP server
 */
const EXAMPLE_RESOURCES = [
  {
    uri: "example://greeting",
    name: "Greeting",
    description: "A simple greeting resource",
    mimeType: "text/plain"
  },
  {
    uri: "example://info",
    name: "Server Info",
    description: "Information about this server",
    mimeType: "text/plain"
  }
];

/**
 * Configure resources for the MCP server
 * 
 * @param server The MCP server instance
 */
export function configureResources(server: Server) {
  
  // Handler for listing available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: EXAMPLE_RESOURCES
    };
  });

  // Handler for reading resource content
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    
    switch (uri) {
      case "example://greeting":
        return {
          contents: [
            {
              uri,
              mimeType: "text/plain",
              text: "Hello from MCP Server!"
            }
          ]
        };
        
      case "example://info":
        return {
          contents: [
            {
              uri,
              mimeType: "text/plain",
              text: `
Server: MCP Node Template
Version: 1.0.0
Description: A template for creating MCP servers with Node.js
`.trim()
            }
          ]
        };
        
      default:
        throw new Error(`Resource not found: ${uri}`);
    }
  });
} 