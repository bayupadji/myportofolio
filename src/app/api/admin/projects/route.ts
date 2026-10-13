import { NextResponse } from "next/server";
import { container } from "@/infrastructure/container";
import { Project } from "@/domain/entities/Project";

export async function GET() {
  try {
    const projects = await container.getAllProjects.execute();
    return NextResponse.json(projects);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    await container.updateProjectStatus(id, status);
    return NextResponse.json({ success: true, id, status });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const project: Project = await req.json();

    if (!project.id || !project.slug || !project.title?.en) {
      return NextResponse.json(
        { error: "id, slug, and title (en) are required" },
        { status: 400 }
      );
    }

    await container.saveProject(project);
    return NextResponse.json({ success: true, project });
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

    await container.deleteProject(id);
    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
