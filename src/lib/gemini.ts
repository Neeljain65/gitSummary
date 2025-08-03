import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


export const aiSummarizeCommits = async(diff:string)=>{

    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an expert programmer, and you are trying to summarize a git diff.
    Reminders about the git diff format:
    For every file, there are a few metadata lines, like (for example):
    \`\`\`
    diff --git a/lib/index.js b/lib/index.js
    index 83db48f..f735d1a 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`
   This means that \lib/index.js was modified in this commit. Note that this is only an example.
   Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line that starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]
Example SUMMARY CONTENT:
    \`\`\`
    * Raised the amount of returned from \`10\` to \`20\`  [packages/server/recording_api.ts]
    * Added a new endpoint to get the recording by ID [packages/server/recording_api.ts]
    * Added openAi for completions [packages/utils/description.ts]
    * Lowered numeric tolerance for the test files
    \`\`\`
    Most commits will have less comments than this examples list.
    the last comment does not have a file name, because there were more than two relevant files.
    Do not include part of example in your summary.
    It is only given as an example.
    please summarize the following git diff : \n\n${diff}

    `,
  });
  return response.candidates[0].content?.parts[0].text || "No summary available";


 }
