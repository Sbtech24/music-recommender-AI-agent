import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const recommenderTool = createTool({
  id: "get-music",
  description: "Give music recommendations to people based on their mood",
  inputSchema: z.object({
    mood: z.string().describe("User's mood, e.g. happy, sad, chill"),
  }),
  outputSchema: z.object({
    text: z.string(),
    recommendations: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        link: z.string(),
        artist: z.string(),
      })
    ),
  }),
  execute: async ({ context }) => {
    const BASE_URL = `https://api.deezer.com/search?q=${context.mood}`;
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();

      const recommendations = data.data.slice(0, 5).map((song: any) => ({
        id: song.id,
        title: song.title,
        link: song.link,
        artist: song.artist.name,
      }));

    interface Song {
      id: number;
      title: string;
      link: string;
      artist: string;
    }

    const text: string = recommendations
      .map((song: Song, i: number) => `${i + 1}. ${song.title} — ${song.artist}\n${song.link}`)
      .join("\n\n");

      return { text, recommendations };
    } catch (e: any) {
      throw new Error(e);
    }
  },
});
