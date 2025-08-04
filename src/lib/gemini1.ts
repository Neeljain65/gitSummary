import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function generateEmbedding(summary: string): Promise<number[]> {
  try {
    const embeddingModel = genAI.getGenerativeModel({
      model: "embedding-001",
    });

    const result = await embeddingModel.embedContent(summary);
    return result.embedding.values;
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      console.error('Rate limit hit for embedding generation, retrying in 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000));
      return generateEmbedding(summary); // Retry once
    }
    console.error('Error generating embedding:', error);
    // Return a zero vector as fallback
    return new Array(768).fill(0);
  }
}

// console.log(await generateEmbedding("This is a test summary for the code file."));


