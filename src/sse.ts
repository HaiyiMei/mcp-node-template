import express, { Request, Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { SERVER_CONFIG } from "./config.js";
import { configureResources } from "./resources/index.js";
import { configureTools } from "./tools/index.js";
import { configurePrompts } from "./prompts/index.js";

/**
 * Main function to start the MCP SSE server
 */
async function main() {
  try {
    console.error("Starting MCP SSE server...");

    // Create a new server instance
    const server = new Server(
      {
        name: SERVER_CONFIG.name,
        version: SERVER_CONFIG.version,
      },
      {
        capabilities: SERVER_CONFIG.capabilities,
      }
    );

    // Configure MCP capabilities
    configureResources(server);
    configureTools(server);
    configurePrompts(server);

    // Create express app
    const app = express();

    // Store transports keyed by sessionId
    const transports: { [sessionId: string]: SSEServerTransport } = {};

    // SSE endpoint for establishing connection
    app.get("/sse", async (_: Request, res: Response) => {
      console.error("New SSE connection request");
      try {
        const transport = new SSEServerTransport("/messages", res);
        transports[transport.sessionId] = transport;
        console.error(
          `SSE connection established with session ID: ${transport.sessionId}`
        );

        res.on("close", () => {
          console.error(
            `SSE connection closed for session ID: ${transport.sessionId}`
          );
          delete transports[transport.sessionId];
        });

        await server.connect(transport);
        console.error(
          `MCP Server connected to transport for session ID: ${transport.sessionId}`
        );
      } catch (error) {
        console.error("Error establishing SSE connection:", error);
        // Ensure response is properly handled in case of error before headers sent
        if (!res.headersSent) {
          res.status(500).send("Failed to establish SSE connection");
        }
      }
    });

    // Endpoint for receiving messages from client
    app.post("/messages", async (req: Request, res: Response) => {
      const sessionId = req.query.sessionId as string;
      console.error(`Received POST to /messages for session ID: ${sessionId}`);
      const transport = transports[sessionId];
      if (transport) {
        try {
          await transport.handlePostMessage(req, res);
          console.error(`Handled POST message for session ID: ${sessionId}`);
        } catch (error) {
          console.error(
            `Error handling POST message for session ID ${sessionId}:`,
            error
          );
          if (!res.headersSent) {
            res.status(500).send("Error processing message");
          }
        }
      } else {
        console.error(`No transport found for session ID: ${sessionId}`);
        res.status(400).send("No transport found for sessionId");
      }
    });

    // Start the express server
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.error(
        `MCP SSE server "${SERVER_CONFIG.name}" v${SERVER_CONFIG.version} listening on port ${port}`
      );
      console.error(`SSE endpoint available at http://localhost:${port}/sse`);
      console.error(
        `Message endpoint available at http://localhost:${port}/messages`
      );
    });
  } catch (error) {
    console.error("Error starting MCP SSE server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
