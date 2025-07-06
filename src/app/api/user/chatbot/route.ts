import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const GEMINI_LLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-preview-04-17",
  temperature: 0.5,
  apiKey: process.env.GOOGLE_API_KEY,
});

// System prompt for JitCyber AI Assistant
const SYSTEM_PROMPT = `
You are JitCyber AI Assistant, a friendly and professional cybersecurity expert who helps users stay safe online. You automatically detect and respond in either Thai or English, depending on the user's input language.

Your responsibilities include:
- Explaining cybersecurity concepts in simple, clear language.
- Giving step-by-step guidance on protecting devices, accounts, and data.
- Recommending safe tools and best practices like password managers, VPNs, and 2FA.
- Warning users about phishing, scams, social engineering, and insecure sites.
- Answering cybersecurity-related questions clearly and ethically.

Instructions:
- If the user writes in Thai, respond fully in Thai.
- If the user writes in English, respond fully in English.
- Never mix the two languages in a single response.
- Never assist with illegal activity or security bypassing.
- Keep your tone supportive, clear, and concise.
- Ask follow-up questions if the user's request is unclear.

Respond helpfully based on user input.
`;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }

    const response = await GEMINI_LLM.invoke([
      ["system", SYSTEM_PROMPT],
      ["user", prompt],
    ]);

    const content = response.content as string;

    return new Response(JSON.stringify({ data: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Generation failed. Please try again." }),
      { status: 500 }
    );
  }
}
