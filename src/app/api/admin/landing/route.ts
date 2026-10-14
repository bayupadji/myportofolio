import { NextResponse } from "next/server";
import { container } from "@/infrastructure/container";

export async function GET() {
  try {
    const [profile, projects] = await Promise.all([
      container.getProfile.execute(),
      container.getAllProjects.execute(),
    ]);

    return NextResponse.json({
      profile,
      projects,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentProfile = await container.getProfile.execute();

    const updatedProfile = {
      ...currentProfile,
      ...body,
    };

    await container.updateProfile(updatedProfile);
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
