import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processUserStory(
  input: string,
  audioData: { data: string; mimeType: string } | null,
  currentCV: CVData,
  language: 'en' | 'ar'
): Promise<{ updatedCV: CVData; message: string; suggestions: string[]; hrTips: string[] }> {
  const prompt = `
You are an expert HR professional and CV writer. The user is building their CV.
They might speak in English or Egyptian Arabic.
Current CV Data (JSON):
${JSON.stringify(currentCV, null, 2)}

User Input (Text):
"${input}"
${audioData ? '\nUser also provided an audio message. Please listen to the audio and extract the information.' : ''}

Task:
1. Analyze the user's input (text and/or audio).
2. Extract any new information (Experience, Education, Skills, Contact, Summary, etc.) and update the Current CV Data.
3. If the user mentions informal terms (especially in Egyptian Arabic), translate and format them into professional, ATS-friendly English terms for the CV Data.
4. Formulate a response message to the user in ${language === 'en' ? 'English' : 'Egyptian Arabic'}. The message should acknowledge what was added, ask smart follow-up questions to uncover hidden skills (e.g., leadership, tools used), and guide them on what to add next.
5. Provide 2-3 suggested skills or additions based on their industry/input.
6. Provide 1-2 HR tips (e.g., "Use action verbs", "Quantify your achievements").

Return the result as a JSON object with the following schema:
{
  "updatedCV": { ... }, // The fully updated CV data object
  "message": "...", // Your conversational response
  "suggestions": ["...", "..."], // Suggested skills or additions
  "hrTips": ["...", "..."] // HR tips
}
`;

  const parts: any[] = [{ text: prompt }];
  if (audioData) {
    parts.push({
      inlineData: {
        data: audioData.data,
        mimeType: audioData.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          updatedCV: {
            type: Type.OBJECT,
            description: "The updated CV data",
            properties: {
              fullName: { type: Type.STRING },
              jobTitle: { type: Type.STRING },
              contact: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                }
              },
              summary: { type: Type.STRING },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.STRING },
                  }
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    graduationDate: { type: Type.STRING },
                  }
                }
              },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          },
          message: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          hrTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["updatedCV", "message", "suggestions", "hrTips"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  
  // Ensure IDs exist for array items
  if (result.updatedCV?.experience) {
    result.updatedCV.experience = result.updatedCV.experience.map((exp: any) => ({
      ...exp,
      id: exp.id || Math.random().toString(36).substring(7)
    }));
  }
  if (result.updatedCV?.education) {
    result.updatedCV.education = result.updatedCV.education.map((edu: any) => ({
      ...edu,
      id: edu.id || Math.random().toString(36).substring(7)
    }));
  }

  return result;
}
