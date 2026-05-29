import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// gemini sdk
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// api route
app.post("/api/interviews/generate/", async (req, res) => {
  try {
    const { role, techStack } = req.body;

    if (!role || !techStack) {
      return res
        .status(400)
        .json({ error: "Role and techStack are required." });
    }

    const prompt = `Act as a senior engineering manager conducting a technical interview. 
            Generate exactly 3 advanced interview questions for a ${role} focusing on ${techStack}. 
            For each question, provide the core concept being tested and a brief framework for the ideal answer.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A list of 3 technical interview questions.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The technical interview question.",
              },
              concept: {
                type: Type.STRING,
                description: "The core concept this question tests.",
              },
              idealAnswer: {
                type: Type.STRING,
                description:
                  "A 2-3 sentence framework of what the perfect candidate would say.",
              },
            },
            required : ["question", "concept", "idealAnswer"]
          },
        },
      },
    });

    const questionsArray = JSON.parse(response.text);

    // frontend 
    res.json(questionsArray);
  } catch (error) {
        console.error("Error generating questions:", error);
        res.status(500).json({ error: "Failed to generate interview prep." });
  }
});

// start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
