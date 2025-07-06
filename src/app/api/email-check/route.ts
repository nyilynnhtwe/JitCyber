import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const GEMINI_LLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-preview-04-17",
  temperature: 0.5,
  apiKey: process.env.GOOGLE_API_KEY,
});

// System prompts for different languages
const SYSTEM_PROMPTS = {
  en: `
You are a cybersecurity assistant. Your job is to analyze email content and determine whether each email is suspicious (phishing, scam, spam, or malicious) or safe.

For each email provided, respond with the following format:

Email #[number]
Suspicion Level: [Safe / Suspicious / Highly Suspicious]
Reason: [Short explanation]
Red Flags: [List any red flags such as urgent language, phishing links, sender mismatches, etc.]

Only respond using this format. Do not add explanations outside it.
  `,
  th: `
คุณเป็นผู้ช่วยด้านความปลอดภัยทางไซเบอร์ หน้าที่ของคุณคือวิเคราะห์เนื้อหาอีเมลและระบุว่าแต่ละอีเมลนั้นน่าสงสัย (การฟิชชิ่ง, การหลอกลวง, สแปม, หรืออันตราย) หรือปลอดภัย

สำหรับแต่ละอีเมลที่ให้มา ให้ตอบกลับในรูปแบบต่อไปนี้:

อีเมล #[number]
ระดับความน่าสงสัย: [ปลอดภัย / น่าสงสัย / น่าสงสัยอย่างยิ่ง]
เหตุผล: [คำอธิบายสั้นๆ]
สัญญาณเตือน: [รายการสัญญาณเตือน เช่น ภาษาเร่งด่วน, ลิงก์ฟิชชิ่ง, ผู้ส่งไม่ตรงกัน ฯลฯ]

ตอบกลับโดยใช้รูปแบบนี้เท่านั้น ห้ามเพิ่มคำอธิบายนอกเหนือจากนี้
  `
};

export async function POST(request: Request) {
  let lang = 'en'; // default

  try {
    const { prompt, locale = 'en' } = await request.json();
    lang = locale === 'th' ? 'th' : 'en';

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({
        error: lang === 'th'
          ? "จำเป็นต้องมีเนื้อหา"
          : "Prompt is required"
      }), {
        status: 400,
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.en;

    const response = await GEMINI_LLM.invoke([
      ["system", systemPrompt],
      ["user", prompt]
    ]);

    const content = response.content as string;

    return new Response(JSON.stringify({ data: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = lang === 'th'
      ? "การสร้างผลลัพธ์ล้มเหลว กรุณาลองอีกครั้ง"
      : "Generation failed. Please try again.";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500
    });
  }
}
