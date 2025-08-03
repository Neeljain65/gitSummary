import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github';
import type { Document } from '@langchain/core/documents';
import { summariseCode } from './gemini';
import { generateEmbedding } from './gemini1';
import { db } from '~/server/db';
import { SourceCode } from 'eslint';

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

console.log(await loadGithubRepo('https://github.com/Neeljain65/gitSummary'));

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


const generateEmbeddings = async(docs: Document[]) => {
    return await Promise.all(docs.map(async (doc) => {
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary);
        return {
            summary,
            embedding,
            source: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        };
    }));
    
}