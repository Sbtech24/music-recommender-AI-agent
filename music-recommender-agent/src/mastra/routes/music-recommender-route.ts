import { registerApiRoute } from "@mastra/core/server";

export const telexWebhook = registerApiRoute("/webhook/telex", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastra = c.get("mastra");
      const agent = mastra.getAgent("musicRecommenderAgent");

      const body = await c.req.json();

      console.log("Incoming Telex webhook:", body);

      // Extract the user's message and reply URL from Telex
      const userMessage = body.event?.message || body.message || "";
      const replyUrl = body.event?.reply_url || body.reply_url;

      if (!userMessage) {
        return c.json({ success: false, error: "No message received" }, 400);
      }

      // Run the Mastra agent to get a music recommendation
      const response = await agent.generate([
        { role: "user", content: userMessage },
      ]);

      const replyText = response.text || "I couldn’t find a recommendation.";

      // Send the reply back to Telex via its provided reply URL
      if (replyUrl) {
        await fetch(replyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_name: "message.create",
            message: replyText,
          }),
        });
      }

      return c.json({
        success: true,
        reply: replyText,
      });
    } catch (error: any) {
      console.error("Webhook error:", error);
      return c.json(
        { success: false, error: error.message },
        500
      );
    }
  },
});
