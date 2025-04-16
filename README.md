# MCP Node Template

A template project for creating [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers using Node.js and TypeScript.

## Features

This template includes all three core MCP capabilities:

- **Resources**: Exposing data and content from your server to LLMs
- **Tools**: Enabling LLMs to perform actions through your server
- **Prompts**: Creating reusable prompt templates and workflows

## Project Structure

```
mcp-node-template/
├── src/
│   ├── index.ts                # Entry point
│   ├── resources/              # Resource definitions and handlers
│   │   └── index.ts
│   ├── tools/                  # Tool definitions and handlers
│   │   └── index.ts
│   ├── prompts/                # Prompt definitions and handlers
│   │   └── index.ts
│   └── config.ts               # Server configuration
```

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build and run the server:
   ```
   npm run dev
   ```

## How to Use

### Connect to Claude for Desktop

To use this server with Claude for Desktop, add the following to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/this/project/build/index.js"]
    }
  }
}
```

### Test with MCP Inspector

You can test this server using the MCP Inspector:

```
npx @modelcontextprotocol/inspector node build/index.js
```

## Extending the Template

### Adding New Resources

Add your resource definitions in `src/resources/index.ts`:

```typescript
// Example of adding a custom resource
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      ...existingResources,
      {
        uri: "custom://resource",
        name: "My Custom Resource",
        description: "Description of my resource"
      }
    ]
  };
});
```

### Adding New Tools

Add your tool definitions in `src/tools/index.ts`:

```typescript
// Example of adding a custom tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  if (name === "custom-tool") {
    const message = args.message as string;
    return {
      content: [
        {
          type: "text",
          text: `Processed: ${message}`
        }
      ]
    };
  }
  // If tool not found
  throw new Error(`Tool not found: ${name}`);
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "custom-tool",
        description: "Description of my custom tool",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Description of my custom tool's message parameter"
            }
          },
          required: ["message"]
        }
      },
    ]
  };
});
```

### Adding New Prompts

Add your prompt definitions in `src/prompts/index.ts`:

```typescript
// Example of adding a custom prompt
PROMPTS["custom-prompt"] = {
  name: "custom-prompt",
  description: "Description of my custom prompt",
  arguments: [
    {
      name: "arg1",
      description: "Argument description",
      required: true
    }
  ]
};
```

## License

MIT 