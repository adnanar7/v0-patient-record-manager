"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Initialize Gemini model
const geminiModel = google("gemini-1.5-pro-latest")

export async function summarizeRecord(recordText: string, audience: "layman" | "doctor"): Promise<string> {
  const prompt =
    audience === "layman"
      ? `Summarize the following medical record in simple, easy-to-understand language for a patient without medical background:\n\n${recordText}`
      : `Provide a detailed medical summary of the following record, using appropriate medical terminology for healthcare professionals:\n\n${recordText}`

  try {
    const { text } = await generateText({
      model: geminiModel,
      prompt,
    })

    return text
  } catch (error) {
    console.error("Error summarizing record:", error)
    return "Failed to generate summary. Please try again later."
  }
}

export async function recognizeHandwriting(imageBase64: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: geminiModel,
      prompt: `This is an image of a doctor's handwritten prescription or medical note. Please transcribe all the text you can see in the image, including medication names, dosages, instructions, and any other relevant information.`,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please transcribe this handwritten medical document:" },
            { type: "image", data: Buffer.from(imageBase64.split(",")[1], "base64") },
          ],
        },
      ],
    })

    return text
  } catch (error) {
    console.error("Error recognizing handwriting:", error)
    return "Failed to recognize handwriting. Please try again later."
  }
}

export async function analyzePatternAcrossRecords(records: string[]): Promise<string> {
  try {
    const recordsText = records.join("\n\n--- Next Record ---\n\n")

    const { text } = await generateText({
      model: geminiModel,
      prompt: `Analyze the following set of medical records for a single patient. Identify any patterns, trends, or potential concerns across these records. Look for changes in vital signs, recurring symptoms, medication adjustments, or any other significant observations:\n\n${recordsText}`,
    })

    return text
  } catch (error) {
    console.error("Error analyzing patterns:", error)
    return "Failed to analyze patterns. Please try again later."
  }
}
