import { NextResponse } from "next/server";
import { container } from "@/infrastructure/container";
import { Profile } from "@/domain/entities/Profile";

export async function GET() {
  try {
    const profile = await container.getProfile.execute();
    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { statusEn, statusId, isFreelance } = body;

    await container.updateAvailability.execute(
      statusEn ?? (isFreelance ? "Available for Q4 Freelance & Product Roles" : "Limited Availability"),
      statusId ?? (isFreelance ? "Tersedia untuk Freelance & Peran Produk Q4" : "Ketersediaan Terbatas"),
      Boolean(isFreelance)
    );

    return NextResponse.json({
      success: true,
      isFreelance: Boolean(isFreelance),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile: Profile = await req.json();
    await container.updateProfile(profile);
    return NextResponse.json({ success: true, profile });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
