import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Configure tools for the MCP server
 * 
 * @param server The MCP server instance
 */
export function configureTools(server: Server) {

  // Register a handler for tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    
    // Example of a tool implementation, remove this if you don't need it
    if (name === "echo") {
      const message = args.message as string;
      return {
        content: [
          {
            type: "text",
            text: `Echo: ${message}`
          }
        ]
      };
    }
    
    // If tool not found
    throw new Error(`Tool not found: ${name}`);
  });
  
  // Register each tool definition for schema information
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // Example of a tool implementation, remove this if you don't need it
        {
          name: "echo",
          description: "Echoes back the input message",
          inputSchema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "The message to echo back"
              }
            },
            required: ["message"]
          }
        }
      ]
    };
  });
} 