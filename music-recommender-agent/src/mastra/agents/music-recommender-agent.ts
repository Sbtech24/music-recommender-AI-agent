import { Agent } from "@mastra/core/agent";
import { recommenderTool } from "../tools/music-recommender-tool";

export const musicRecommenderAgent = new Agent({
  name: "musicRecommenderAgent",
  instructions: `
You are a friendly and helpful assistant that recommends songs to users based on their mood.

1. Start by asking the user how they are feeling today.
2. When the user tells you their mood (e.g., happy, sad, chill, excited, etc.),
   use the "recommenderTool" to fetch suitable song recommendations.
3. Respond naturally with one or more songs that match their mood.
4. Add the links to the songs
5. Recommend random songs from the list of songs provided
  `,
  model: "google/gemini-2.5-flash",
  tools: [recommenderTool],
});
