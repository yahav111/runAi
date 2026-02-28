import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";
import { detectIntent } from "@/lib/intent-detector";
import { getLastUserMessageText, getAnsweredPreferences } from "@/lib/chat-utils";
import { buildPointToPointPrompt } from "@/lib/prompts/point-to-point";
import { buildLoopPrompt } from "@/lib/prompts/loop";
import { buildSurveyPrompt } from "@/lib/prompts/survey";

export const maxDuration = 30;

const MAX_MESSAGES_FOR_MODEL = 20;

function resolveSystemPrompt(
  uiMessages: UIMessage[],
  lastUserText: string,
  userName?: string,
  userLevel?: string
): string {
  const intent = detectIntent(lastUserText);

  switch (intent.type) {
    case "point-to-point":
      return buildPointToPointPrompt(
        intent.data.from,
        intent.data.to,
        userName,
        userLevel
      );
    case "loop":
      return buildLoopPrompt(
        intent.data.location,
        intent.data.distanceOrTime,
        userName,
        userLevel
      );
    case "survey":
    default: {
      const answeredPreferences = getAnsweredPreferences(uiMessages);
      return buildSurveyPrompt(userName, userLevel, answeredPreferences);
    }
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return Response.json(
        {
          error:
            "Missing or invalid GROQ_API_KEY. Add it to .env.local (get a key at https://console.groq.com/keys)",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages: uiMessages, data } = body as {
      messages?: UIMessage[];
      data?: { userName?: string; userLevel?: string };
    };

    if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
      return Response.json(
        { error: "Request must include a non-empty messages array." },
        { status: 400 }
      );
    }

    const lastUserText = getLastUserMessageText(uiMessages);
    const systemPrompt = resolveSystemPrompt(
      uiMessages,
      lastUserText,
      data?.userName,
      data?.userLevel
    );

    const trimmedMessages =
      uiMessages.length > MAX_MESSAGES_FOR_MODEL
        ? uiMessages.slice(-MAX_MESSAGES_FOR_MODEL)
        : uiMessages;
    const modelMessages = await convertToModelMessages(trimmedMessages);
    const modelId = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    const result = streamText({
      model: groq(modelId),
      system: systemPrompt,
      messages: modelMessages,
      temperature: 0.35,
      maxOutputTokens: 4096,
      maxRetries: 2,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[RunIsrael AI] Chat API error:", err);
    const rawMessage = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: `Chat failed: ${rawMessage}` },
      { status: 500 }
    );
  }
}
