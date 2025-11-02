import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { ArtistData } from "../../../utils/types";

export const recommenderTool = createTool({
  id: "get-music",
  description: "Give music recommendations to people based on their mood",
  inputSchema: z.object({
    mood: z.string().describe("User's mood, e.g. happy, sad, chill"),
  }),
  outputSchema: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      link: z.string(),
      artist: z.object({
        name: z.string(),
      }),
    })
  ),
  execute: async ({ context }) => {
    const BASE_URL = `https://api.deezer.com/search?q=${context.mood}`;

    try {
      const response = await fetch(BASE_URL);
      const data: ArtistData = await response.json();

      if (!data.data || data.data.length === 0)
        throw new Error("No songs found for this mood");

      const songs = data.data.slice(0, data.data.length-1).map((song) => ({
        id: song.id,
        title: song.title,
        link: song.link,
        artist: { name: song.artist.name },
      }));

      return songs;
    } catch (e: any) {
      throw new Error(e.message || "Something went wrong");
    }
  },
});
