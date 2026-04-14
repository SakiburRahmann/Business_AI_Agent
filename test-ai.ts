import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

async function main() {
  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: 'say hello',
    });
    console.log("Success:", text);
  } catch (err) {
    console.error("Failed:", err);
  }
}

main();
