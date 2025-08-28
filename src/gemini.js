// gemini.js
// gemini.js
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyCIwtkQeR4PIE63AM_KCQF7f7qcRZ8ATS0"; // keep in .env

const ai = new GoogleGenAI({ apiKey });

async function main(prompt) {
  try {
    const model = "gemini-2.5-flash";

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `
              You are a friendly female AI assistant.
              - Detect user language automatically:
                • If user types English → reply in English.  
                • If user types Hindi/Hinglish → reply in Hinglish (mix Hindi + English naturally).  
              - Speak in natural tone, max 40–60 words.
              - Avoid robotic replies, keep it smooth & conversational.

              User said: ${prompt}
            `,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      generationConfig: {
        temperature: 0.85,
        topP: 0.9,
        maxOutputTokens: 120,
        responseMimeType: "text/plain",
      },
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, mujhe samajh nahi aaya.";

    return text.trim();
  } catch (err) {
    console.error("Gemini error:", err);
    return "Oops, kuch problem ho gayi.";
  }
}

export default main;



// let apiKey = "AIzaSyCIwtkQeR4PIE63AM_KCQF7f7qcRZ8ATS0";

// // To run this code you need:
// // npm install @google/genai

// import { GoogleGenAI } from "@google/genai";

// async function main(prompt) {
//   const ai = new GoogleGenAI({
//     apiKey: apiKey,
//   });

//   const model = "gemini-2.5-flash"; // ✅ text-only model
//   const contents = [
//     {
//       role: "user",
//       parts: [
//         { text: `${prompt}. Please answer only in 20–30 words.` }, // force short
//       ],
//     },
//   ];

//   const response = await ai.models.generateContent({
//     model,
//     contents,
//     generationConfig: {
//       temperature:1,
//       topP:0.95,
//       maxOutputTokens: 20, // ~20-30 words (approx 2–3 tokens per word)
//       responseMimeType: "text/plain",
//     },
//   });

//   // ✅ Return text response instead of saving files
//   const text =
//     response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
//   return text;
// }

// export default main;
