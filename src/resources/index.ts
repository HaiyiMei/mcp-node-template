import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  ListResourcesRequestSchema, 
  ReadResourceRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Example resources to expose through the MCP server
 */
const EXAMPLE_RESOURCES = [
  // Example resource, remove this if you don't need it
  {
    uri: "example://greeting",
    name: "Greeting",
    description: "A simple greeting resource",
    mimeType: "text/plain"
  },
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
        
      default:
        throw new Error(`Resource not found: ${uri}`);
    }
  });
} 