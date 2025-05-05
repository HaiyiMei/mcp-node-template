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
│   ├── sse.ts                  # Server-Sent Events handler
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
      "args": ["/absolute/path/to/this/project/build/index.js"]
    }
  }
}
```

## Test with MCP Inspector

You can test this server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

You can pass both arguments and environment variables to your MCP server. Arguments are passed directly to your server, while environment variables can be set using the `-e` flag:

```bash
# Pass arguments only
npx @modelcontextprotocol/inspector node build/index.js arg1 arg2

# Pass environment variables only
npx @modelcontextprotocol/inspector -e key=value -e key2=$VALUE2 node build/index.js

# Pass both environment variables and arguments
npx @modelcontextprotocol/inspector -e key=value -e key2=$VALUE2 node build/index.js arg1 arg2

# Use -- to separate inspector flags from server arguments
npx @modelcontextprotocol/inspector -e key=$VALUE -- node build/index.js -e server-flag
```

The inspector runs both an MCP Inspector (MCPI) client UI (default port 6274) and an MCP Proxy (MCPP) server (default port 6277). Open the MCPI client UI in your browser to use the inspector.

### CLI Mode

CLI mode enables programmatic interaction with MCP servers from the command line, ideal for scripting, automation, and integration with coding assistants. This creates an efficient feedback loop for MCP server development.

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js
```

The CLI mode supports most operations across tools, resources, and prompts. A few examples:

```bash
# Basic usage
npx @modelcontextprotocol/inspector --cli node build/index.js

# With config file
npx @modelcontextprotocol/inspector --cli --config path/to/config.json --server myserver

# List available tools
npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list

# Call a specific tool
npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/call --tool-name mytool --tool-arg key=value --tool-arg another=value2

# List available resources
npx @modelcontextprotocol/inspector --cli node build/index.js --method resources/list

# List available prompts
npx @modelcontextprotocol/inspector --cli node build/index.js --method prompts/list

# Connect to a remote MCP server
npx @modelcontextprotocol/inspector --cli https://my-mcp-server.example.com

# Call a tool on a remote server
npx @modelcontextprotocol/inspector --cli https://my-mcp-server.example.com --method tools/call --tool-name remotetool --tool-arg param=value

# List resources from a remote server
npx @modelcontextprotocol/inspector --cli https://my-mcp-server.example.com --method resources/list
```

### Configuration

The MCP Inspector supports the following configuration settings. To change them, click on the `Configuration` button in the MCP Inspector UI:

| Setting                                 | Description                                                                                                  | Default |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| `MCP_SERVER_REQUEST_TIMEOUT`            | Timeout for requests to the MCP server (ms)                                                                  | 10000   |
| `MCP_REQUEST_TIMEOUT_RESET_ON_PROGRESS` | Reset timeout on progress notifications                                                                      | true    |
| `MCP_REQUEST_MAX_TOTAL_TIMEOUT`         | Maximum total timeout for requests sent to the MCP server (ms) (Use with progress notifications)             | 60000   |
| `MCP_PROXY_FULL_ADDRESS`                | Set this if you are running the MCP Inspector Proxy on a non-default address. Example: http://10.1.1.22:5577 | ""      |

These settings can be adjusted in real-time through the UI and will persist across sessions.

### Configuration Files

The inspector supports configuration files to store settings for different MCP servers. This is useful when working with multiple servers or complex configurations:

```bash
npx @modelcontextprotocol/inspector --config path/to/config.json --server everything
```

Example server configuration file:

```json
{
  "mcpServers": {
    "everything": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-everything"],
      "env": {
        "hello": "Hello MCP!"
      }
    },
    "my-server": {
      "command": "node",
      "args": ["build/index.js", "arg1", "arg2"],
      "env": {
        "key": "value",
        "key2": "value2"
      }
    }
  }
}
```

### UI Mode vs CLI Mode: When to Use Each

| Use Case                 | UI Mode                                                                   | CLI Mode                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Server Development**   | Visual interface for interactive testing and debugging during development | Scriptable commands for quick testing and continuous integration; creates feedback loops with AI coding assistants like Cursor for rapid development |
| **Resource Exploration** | Interactive browser with hierarchical navigation and JSON visualization   | Programmatic listing and reading for automation and scripting                                                                                        |
| **Tool Testing**         | Form-based parameter input with real-time response visualization          | Command-line tool execution with JSON output for scripting                                                                                           |
| **Prompt Engineering**   | Interactive sampling with streaming responses and visual comparison       | Batch processing of prompts with machine-readable output                                                                                             |
| **Debugging**            | Request history, visualized errors, and real-time notifications           | Direct JSON output for log analysis and integration with other tools                                                                                 |
| **Automation**           | N/A                                                                       | Ideal for CI/CD pipelines, batch processing, and integration with coding assistants                                                                  |
| **Learning MCP**         | Rich visual interface helps new users understand server capabilities      | Simplified commands for focused learning of specific endpoints                                                                                       |

## License

MIT
