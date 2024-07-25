import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

interface ChatMessage {
    role: string;
    content: string;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: ChatMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use Code comments for explanations."
}

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("OpenAI API Key not configured.", { status: 500 });
        }

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        return NextResponse.json(chatCompletion);
    } catch (error) {
        console.error('[CODE_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
