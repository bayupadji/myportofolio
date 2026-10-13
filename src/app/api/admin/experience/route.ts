import { NextResponse } from "next/server";
import { container } from "@/infrastructure/container";
import { Experience } from "@/domain/entities/Experience";

export async function GET() {
  try {
    const list = await container.getExperiences.execute();
    return NextResponse.json(list);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const item: Experience = await req.json();
    if (!item.id || !item.company || !item.role?.en) {
      return NextResponse.json(
        { error: "id, company, and role (en) are required" },
        { status: 400 }
      );
    }
    await container.saveExperience(item);
    return NextResponse.json({ success: true, experience: item });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await container.deleteExperience(id);
    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
