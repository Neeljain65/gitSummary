import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function generateEmbedding(summary: string) {
  const embeddingModel = genAI.getGenerativeModel({
    model: "embedding-001",
  });

  const result = await embeddingModel.embedContent(summary);
  return result.embedding.values;
}

// console.log(await generateEmbedding("This is a test summary for the code file."));


