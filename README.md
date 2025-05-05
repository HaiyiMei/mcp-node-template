# MCP Node.js Template

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
│   ├── index.ts                # Main entry point
│   ├── config.ts               # Server configuration
│   ├── resources/              # Resource definitions and handlers
│   │   └── index.ts
│   ├── prompts/                # Prompt definitions and handlers
│   │   └── index.ts
│   └── tools/                  # Tool definitions and handlers
│       └── index.ts
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. If you need to add custom environment variables, copy the example environment file:
   ```
   cp .env.example .env
   ```
4. Build and run the server:
   ```
   npm run dev
   ```

## Docker Support

You can also run this application using Docker:

1. Build the Docker image:
   ```
   docker build --load -t mcp-node-server .
   ```

2. Run the container:
   ```
   docker run -d -p 3000:3000 mcp-node-server
   ```

The Dockerfile uses Node 20 Alpine as the base image, installs dependencies, builds the application, and runs the server using `npm run start`.

## Extending the Template

**REMEMBER** to remove the example resources, tools, and prompts in the `index.ts` files before deploying your server.

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
        description: "Description of my resource",
      },
    ],
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
          text: `Processed: ${message}`,
        },
      ],
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
              description: "Description of my custom tool's message parameter",
            },
          },
          required: ["message"],
        },
      },
    ],
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
      required: true,
    },
  ],
};
```

### Notes

Please avoid using `console.log` in your code. Because it would be sent wrongly to the MCP Client.


## How to Use

### Connect to Claude for Desktop

To use this server with Claude for Desktop, add the following to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/this/project/dist/index.js"]
    }
  }
}
```

## Test with MCP Inspector

You can test this server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

You can pass both arguments and environment variables to your MCP server. Arguments are passed directly to your server, while environment variables can be set using the `-e` flag:

```bash
# Pass arguments only
npx @modelcontextprotocol/inspector node dist/index.js arg1 arg2

# Pass environment variables only
npx @modelcontextprotocol/inspector -e key=value -e key2=$VALUE2 node dist/index.js

# Pass both environment variables and arguments
npx @modelcontextprotocol/inspector -e key=value -e key2=$VALUE2 node dist/index.js arg1 arg2

# Use -- to separate inspector flags from server arguments
npx @modelcontextprotocol/inspector -e key=$VALUE -- node dist/index.js -e server-flag
```

The inspector runs both an MCP Inspector (MCPI) client UI (default port 6274) and an MCP Proxy (MCPP) server (default port 6277). Open the MCPI client UI in your browser to use the inspector.

### CLI Mode

CLI mode enables programmatic interaction with MCP servers from the command line, ideal for scripting, automation, and integration with coding assistants. This creates an efficient feedback loop for MCP server development.

```bash
npx @modelcontextprotocol/inspector --cli node dist/index.js
```