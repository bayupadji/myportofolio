import { NextResponse } from "next/server";
import { container } from "@/infrastructure/container";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await container.submitContactMessage.execute({
      name: body.name,
      email: body.email,
      topic: body.topic,
      body: body.body,
      honeypot: body.honeypot,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
