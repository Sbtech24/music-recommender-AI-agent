import { registerApiRoute } from "@mastra/core/server";

// simple random ID generator
function generateId() {
  return "id-" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export const telexWebhook = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastraInstance = c.get("mastra");
      const agentId = c.req.param("agentId");

      const body = await c.req.json();

      if (!body || Object.keys(body).length === 0) {
        return await c.json(
          {
            status: "ok",
            message: "Webhook received successfully, but no data was provided.",
          },
          200
        );
      }

      const { jsonrpc, id: requestId, method, params } = body;

      if (jsonrpc !== "2.0" || !requestId) {
        return await c.json(
          {
            jsonrpc: "2.0",
            id: requestId || null,
            error: {
              code: -32600,
              message: 'Invalid Request: jsonrpc must be "2.0" and id is required',
            },
          },
          400
        );
      }

      const agent = mastraInstance.getAgent(agentId);
      if (!agent) {
        return await c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message: `Agent '${agentId}' not found`,
            },
          },
          404
        );
      }

      const { message, messages, contextId, taskId } = params || {};
      let messagesList = [];

      if (message) messagesList = [message];
      else if (Array.isArray(messages)) messagesList = messages;

      const mastraMessages = messagesList.map((msg) => ({
        role: msg.role,
        content:
          msg.parts
            ?.map((part: any) =>
              part.kind === "text"
                ? part.text
                : part.kind === "data"
                ? JSON.stringify(part.data)
                : ""
            )
            .join("\n") || "",
      }));

      const response = await agent.generate(mastraMessages);
      const agentText = response.text || "No response generated.";

      const artifacts = [
        {
          artifactId: generateId(),
          name: `${agentId}Response`,
          parts: [{ kind: "text", text: agentText }],
        },
      ];

      if (response.toolResults?.length) {
        artifacts.push({
          artifactId: generateId(),
          name: "ToolResults",
          parts: response.toolResults.map((result) => ({
            kind: "data",
            text: JSON.stringify(result),
          })),
        });
      }

      const history = [
        ...messagesList.map((msg) => ({
          kind: "message",
          role: msg.role,
          parts: msg.parts,
          messageId: msg.messageId || generateId(),
          taskId: msg.taskId || taskId || generateId(),
        })),
        {
          kind: "message",
          role: "agent",
          parts: [{ kind: "text", text: agentText }],
          messageId: generateId(),
          taskId: taskId || generateId(),
        },
      ];

      return await c.json({
        jsonrpc: "2.0",
        id: requestId,
        result: {
          id: taskId || generateId(),
          contextId: contextId || generateId(),
          status: {
            state: "completed",
            timestamp: new Date().toISOString(),
            message: {
              messageId: generateId(),
              role: "agent",
              parts: [{ kind: "text", text: agentText }],
              kind: "message",
            },
          },
          artifacts,
          history,
          kind: "task",
        },
      });
    } catch (error: any) {
      console.error("Webhook Error:", error);
      return await c.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32603,
            message: "Internal error",
            data: { details: error.message },
          },
        },
        500
      );
    }
  },
});
