import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  ListPromptsRequestSchema, 
  GetPromptRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Example prompts to expose through the MCP server
 */
const PROMPTS: Record<string, any> = {
  "greeting": {
    name: "greeting",
    description: "Generate a customized greeting",
    arguments: [
      {
        name: "name",
        description: "The name to greet",
        required: true
      },
      {
        name: "style",
        description: "Style of greeting (formal, casual, enthusiastic)",
        required: false
      }
    ]
  },
  "summarize": {
    name: "summarize",
    description: "Create a summary of text",
    arguments: [
      {
        name: "text",
        description: "The text to summarize",
        required: true
      },
      {
        name: "length",
        description: "Length of summary (short, medium, long)",
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
    
    if (name === "greeting") {
      const personName = args?.name || "User";
      const style = args?.style || "casual";
      
      let prompt = "";
      let systemRole = "";
      
      switch (style) {
        case "formal":
          systemRole = "You are a formal and professional assistant.";
          prompt = `Please provide a formal greeting for ${personName}.`;
          break;
        case "enthusiastic":
          systemRole = "You are an enthusiastic and energetic assistant.";
          prompt = `Please provide an enthusiastic and energetic greeting for ${personName}!`;
          break;
        case "casual":
        default:
          systemRole = "You are a friendly and casual assistant.";
          prompt = `Please provide a friendly greeting for ${personName}.`;
          break;
      }
      
      return {
        messages: [
          {
            role: "system",
            content: {
              type: "text",
              text: systemRole
            }
          },
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
    
    if (name === "summarize") {
      const text = args?.text || "";
      const length = args?.length || "medium";
      
      let wordCount: string;
      
      switch (length) {
        case "short":
          wordCount = "50";
          break;
        case "long":
          wordCount = "200";
          break;
        case "medium":
        default:
          wordCount = "100";
          break;
      }
      
      return {
        messages: [
          {
            role: "system",
            content: {
              type: "text",
              text: `You are a helpful assistant that creates clear and concise summaries.`
            }
          },
          {
            role: "user",
            content: {
              type: "text",
              text: `Please summarize the following text in approximately ${wordCount} words:\n\n${text}`
            }
          }
        ]
      };
    }
    
    throw new Error(`Prompt not found: ${name}`);
  });
  
  console.error("Prompts configured");
} 