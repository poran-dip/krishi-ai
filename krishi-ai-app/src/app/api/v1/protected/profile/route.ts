// app/api/v1/protected/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthUser } from "@/lib/auth";

export interface Farmer {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  settings: {
    languagePreference: string;
    city: string;
    state: string;
    farmSize: number;
    farmType: string;
    organicCertified: boolean;
    latitude?: number;
    longitude?: number;
  };
  crops: {
    id: string;
    name: string;
  }[];
  futureCrops?: {
    id: string;
    name: string;
  }[];
  revenue?: number;
  lastSync: string;
}

// in-memory db (replace with actual DB later)
const farmerStore: Record<string, Farmer> = {};

export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const farmer = farmerStore[user.userId];

    if (!farmer) {
      return NextResponse.json(
        { message: "No profile found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile data retrieved successfully",
      data: farmer,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const body = await request.json();
    const existingFarmer = farmerStore[user.userId];

    const updatedFarmer: Farmer = {
      ...existingFarmer,
      ...body,
      settings: {
        ...existingFarmer?.settings,
        ...body.settings,
      },
      crops: body.crops ?? existingFarmer?.crops ?? [],
      futureCrops: body.futureCrops ?? existingFarmer?.futureCrops ?? [],
      revenue: body.revenue ?? existingFarmer?.revenue ?? 0,
      lastSync: new Date().toISOString(),
      // if new user, fallback with auth data
      name: body.name ?? `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: body.phone ?? "+91 9876543210",
    };

    farmerStore[user.userId] = updatedFarmer;

    return NextResponse.json({
      message: "Profile updated successfully",
      ...updatedFarmer,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
