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
    
    // Echo tool implementation
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
    
    // Timestamp tool implementation
    if (name === "timestamp") {
      const format = (args.format as "iso" | "unix" | "readable") || "iso";
      const now = new Date();
      
      let formattedTime: string;
      
      switch (format) {
        case "unix":
          formattedTime = Math.floor(now.getTime() / 1000).toString();
          break;
        case "readable":
          formattedTime = now.toLocaleString();
          break;
        case "iso":
        default:
          formattedTime = now.toISOString();
          break;
      }
      
      return {
        content: [
          {
            type: "text",
            text: formattedTime
          }
        ]
      };
    }
    
    // Calculator tool implementation
    if (name === "calculator") {
      const operation = args.operation as "add" | "subtract" | "multiply" | "divide";
      const a = Number(args.a);
      const b = Number(args.b);
      
      let result: number;
      
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: "Error: Division by zero"
                }
              ]
            };
          }
          result = a / b;
          break;
        default:
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error: Unknown operation '${operation}'`
              }
            ]
          };
      }
      
      return {
        content: [
          {
            type: "text",
            text: result.toString()
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
        },
        {
          name: "timestamp",
          description: "Returns the current timestamp in various formats",
          inputSchema: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: ["iso", "unix", "readable"],
                description: "The format of the timestamp",
                default: "iso"
              }
            }
          }
        },
        {
          name: "calculator",
          description: "Performs basic arithmetic operations",
          inputSchema: {
            type: "object",
            properties: {
              operation: {
                type: "string",
                enum: ["add", "subtract", "multiply", "divide"],
                description: "The operation to perform"
              },
              a: {
                type: "number",
                description: "First number"
              },
              b: {
                type: "number",
                description: "Second number"
              }
            },
            required: ["operation", "a", "b"]
          }
        }
      ]
    };
  });
} 