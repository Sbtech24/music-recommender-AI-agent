🎧 Music Recommender Agent

An AI-powered music recommendation bot that suggests songs based on your mood — built with Mastra, connected to Telex, and powered by a music API.

The agent interprets how you feel (e.g., happy, sad, chill, excited) and recommends songs that match your vibe — making your listening experience more personal and intuitive.

🚀 Features

🧠 AI Mood Detection — Understands your emotions from natural text.

🎶 Smart Song Recommendations — Fetches songs that fit your current mood.

⚡ Mastra Agent Integration — Built using Mastra’s agent framework.

🔗 Telex A2A Compatibility — Fully supports App-to-App JSON-RPC communication.

☁️ Mastra Cloud Deployment — Easily hosted and connected to webhooks.

🏗️ Project Structure
src/
 ├── agents/
 │    └── music-recommender-agent.ts      # Defines the AI agent
 ├── tools/
 │    └── music-recommender-tool.ts       # Handles API calls to fetch songs
 ├── routes/
 │    └── telex-webhook.ts                # A2A webhook route for Telex
 ├── scorers/
 │    └── weather-scorer.ts               # Example scorers (optional)
 ├── mastra.ts                            # Mastra setup and configuration

⚙️ Tech Stack

Mastra — AI agent framework

Telex — A2A integration platform

TypeScript — Typed backend logic

LibSQL — For local agent state

Pino Logger — For logging and observability
