import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const GEMINI_LLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-preview-04-17",
  temperature: 0.5,
  apiKey: process.env.GOOGLE_API_KEY,
});

// System prompt for detecting suspicious emails
const SYSTEM_PROMPT = `
You are a cybersecurity assistant. Your job is to analyze email content and determine whether each email is suspicious (phishing, scam, spam, or malicious) or safe.

For each email provided, respond with the following format:

Email #[number]
Suspicion Level: [Safe / Suspicious / Highly Suspicious]
Reason: [Short explanation]
Red Flags: [List any red flags such as urgent language, phishing links, sender mismatches, etc.]

Only respond using this format. Do not add explanations outside it.
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
      ["user", prompt]
    ]);

    const content = response.content as string;

    return new Response(JSON.stringify({ data: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({
      error: "Generation failed. Please try again."
    }), { status: 500 });
  }
}

