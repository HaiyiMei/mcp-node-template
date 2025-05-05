import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  ListPromptsRequestSchema, 
  GetPromptRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Example prompts to expose through the MCP server
 */
const PROMPTS: Record<string, any> = {
  // Example prompt, remove this if you don't need it
  "greeting": {
    name: "greeting",
    description: "Generate a customized greeting",
    arguments: [
      {
        name: "style",
        description: "Style of greeting (formal, casual, enthusiastic)",
        required: false
      }
    ]
  }
};

/**
 * Configure prompts for the MCP server
 * 
 * @param server The MCP server instance
 */
export function configurePrompts(server: Server) {
  
  // Handler for listing available prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: Object.values(PROMPTS)
    };
  });

  // Handler for getting prompt content
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    // Example prompt, remove this if you don't need it
    if (name === "greeting") {
      const style = args?.style || "casual";
      let prompt = "";
      switch (style) {
        case "formal":
          prompt = `Please provide a formal greeting.`;
          break;
        case "enthusiastic":
          prompt = `Please provide an enthusiastic and energetic greeting.`;
          break;
        case "casual":
        default:
          prompt = `Please provide a friendly greeting.`;
          break;
      }
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: prompt
            }
          }
        ]
      };
    }
    
    throw new Error(`Prompt not found: ${name}`);
  });
} 