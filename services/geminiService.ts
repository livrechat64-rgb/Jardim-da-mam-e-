
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysisResult, PlantHealthStatus } from "../types";

const MOCK_API_KEY = process.env.API_KEY || ""; 

const ai = new GoogleGenAI({ apiKey: MOCK_API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        species: {
            type: Type.STRING,
            description: "O nome comum da espécie da planta identificada na imagem (em Português), ex: 'Orquídea Phalaenopsis' ou 'Jiboia'."
        },
        notes: {
            type: Type.STRING,
            description: "Uma breve observação e dica de cuidado sobre a planta identificada (em Português), ex: 'Precisa de luz indireta e rega moderada. Típica de ambiente interno.'"
        },
        isToxic: {
            type: Type.BOOLEAN,
            description: "True se a planta for conhecida por ser tóxica ou prejudicial para animais de estimação comuns (cães, gatos), false caso contrário."
        }
    },
    required: ["species", "notes", "isToxic"]
};

export const analyzePlantImage = async (base64Data: string, mimeType: string): Promise<PlantAnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: "Analise esta imagem de planta e gere o JSON estruturado." },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    }
                ]
            },
            config: {
                systemInstruction: "Você é um bot assistente de jardinagem. Sua tarefa é analisar a imagem de uma planta e fornecer sua espécie, observações concisas de cuidado e se é tóxica para animais de estimação comuns (cães/gatos). Responda APENAS com o JSON. NÃO adicione texto explicativo fora do JSON.",
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        });
        
        const jsonText = response.text.trim();
        const plantData = JSON.parse(jsonText);

        if (!plantData || typeof plantData.species !== 'string' || typeof plantData.notes !== 'string' || typeof plantData.isToxic !== 'boolean') {
            throw new Error("Invalid JSON structure from Gemini API");
        }
        
        return plantData as PlantAnalysisResult;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze image with AI.");
    }
};

export const analyzePlantHealth = async (notes: string): Promise<PlantHealthStatus> => {
    // Default to 'Healthy' if there are no notes to analyze.
    if (!notes || notes.trim() === '') {
        return 'Healthy';
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following plant notes and classify its health status. Respond with ONLY one of the following words: "Healthy", "Needs Attention", or "Critical". For example, if notes say "folhas amareladas" (yellow leaves) or "praga" (pest), it might be "Needs Attention". If it says "parece estar morrendo" (looks like it's dying), it could be "Critical". If notes are positive like "crescendo bem" (growing well), it's "Healthy". Notes: "${notes}"`,
            config: {
                systemInstruction: "You are a plant health classification assistant. Your only job is to output one of three specific classifications based on user notes: 'Healthy', 'Needs Attention', or 'Critical'. Do not add any other text.",
                temperature: 0,
            }
        });
        
        const text = response.text.trim().replace(/"/g, '');

        if (text === 'Healthy' || text === 'Needs Attention' || text === 'Critical') {
            return text as PlantHealthStatus;
        }
        
        console.warn(`Unexpected health analysis response from Gemini: "${text}". Defaulting to 'Healthy'.`);
        return 'Healthy';
    } catch (error) {
        console.error("Error calling Gemini API for health analysis:", error);
        return 'Healthy';
    }
};
