import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github';
import type { Document } from '@langchain/core/documents';
import { summariseCode } from './gemini';
import { generateEmbedding } from './gemini1';
import { db } from '~/server/db';

export const loadGithubRepo = async(githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || process.env.GITHUB_TOKEN,
        branch: 'main',
        ignoreFiles : ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5,
    });
    const docs = await loader.load();
    return docs
}

export const indexGithubRepo = async(projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);

    await Promise.allSettled(
        allEmbeddings.map(async (embedding, index) => {
            console.log(`processing ${index} of ${allEmbeddings.length}`);
            if (!embedding) return;

            const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
                data: {
                    summary: embedding.summary,
                    sourceCode: embedding.sourceCode,
                    fileName: embedding.fileName,
                    projectId,
                },
            });

            await db.$executeRaw`
                UPDATE "SourceCodeEmbedding"
                SET "summaryEmbedding" = ${embedding.embedding}::vector
                WHERE id = ${sourceCodeEmbedding.id}`;
        })
    );
};

// Rate limiting utility function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateEmbeddings = async(docs: Document[]) => {
    const embeddings: any[] = [];
    const BATCH_SIZE = 8; // Stay well under the 10 requests/minute limit
    const DELAY_BETWEEN_BATCHES = 70000; // 70 seconds between batches (safe margin)
    const DELAY_BETWEEN_REQUESTS = 1000; // 1 second between individual requests
    
    console.log(`Processing ${docs.length} documents in batches of ${BATCH_SIZE}`);
    
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(docs.length / BATCH_SIZE)}`);
        
        const batchResults = [];
        
        for (const doc of batch) {
            try {
                console.log(`Processing file: ${doc.metadata.source}`);
                const summary = await summariseCode(doc);
                await delay(DELAY_BETWEEN_REQUESTS); // Small delay between requests
                
                const embedding = await generateEmbedding(summary);
                
                batchResults.push({
                    summary,
                    embedding,
                    sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
                    fileName: doc.metadata.source,
                });
                
                await delay(DELAY_BETWEEN_REQUESTS); // Small delay after embedding
            } catch (error) {
                console.error(`Error processing ${doc.metadata.source}:`, error);
                // Continue with next document even if one fails
                batchResults.push(null);
            }
        }
        
        embeddings.push(...batchResults);
        
        // If there are more batches to process, wait before the next batch
        if (i + BATCH_SIZE < docs.length) {
            console.log(`Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`);
            await delay(DELAY_BETWEEN_BATCHES);
        }
    }
    
    // Filter out null results (failed processing)
    return embeddings.filter(embedding => embedding !== null);
}
