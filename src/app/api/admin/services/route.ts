import { NextResponse } from "next/server";
import { container } from "@/infrastructure/container";
import { Service } from "@/domain/entities/Service";

export async function GET() {
  try {
    const list = await container.getServices.execute();
    return NextResponse.json(list);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const item: Service = await req.json();
    if (!item.id || !item.slug || !item.title?.en) {
      return NextResponse.json(
        { error: "id, slug, and title (en) are required" },
        { status: 400 }
      );
    }
    await container.saveService(item);
    return NextResponse.json({ success: true, service: item });
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
    await container.deleteService(id);
    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
