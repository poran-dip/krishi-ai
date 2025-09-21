// app/api/v1/protected/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthUser } from "@/lib/auth";
import { prisma } from '@/lib/prisma'
import { Crop } from "@/generated/prisma";

export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const farmer = await prisma.farmer.findUnique({
      where: { id: user.userId },
      include: {
        settings: true,
        crops: {
          select: {
            id: true,
            name: true,
            isFuture: true,
            status: true
          }
        }
      }
    });

    if (!farmer) {
      return NextResponse.json(
        { message: "No profile found for this user" },
        { status: 404 }
      );
    }

    // Separate current and future crops
    const currentCrops = farmer.crops.filter(crop => !crop.isFuture);
    const futureCrops = farmer.crops.filter(crop => crop.isFuture);

    const profileData = {
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone,
      avatar: farmer.avatar,
      revenue: farmer.revenue,
      settings: farmer.settings ? {
        languagePreference: farmer.settings.languagePreference,
        city: farmer.settings.city,
        state: farmer.settings.state,
        farmSize: farmer.settings.farmSize,
        farmType: farmer.settings.farmType,
        organicCertified: farmer.settings.organicCertified,
        latitude: farmer.settings.latitude,
        longitude: farmer.settings.longitude,
      } : null,
      crops: currentCrops.map(crop => ({
        id: crop.id,
        name: crop.name,
        status: crop.status
      })),
      futureCrops: futureCrops.map(crop => ({
        id: crop.id,
        name: crop.name,
        status: crop.status
      })),
      lastSync: farmer.lastSync.toISOString(),
    };

    return NextResponse.json({
      message: "Profile data retrieved successfully",
      data: profileData,
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

    // Update farmer and settings in a transaction
    const updatedFarmer = await prisma.$transaction(async (tx) => {
      // Build update data with only provided fields
      const farmerUpdateData = {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
        ...(body.revenue !== undefined && { revenue: body.revenue }),
        lastSync: new Date()
      };

      // Update farmer basic info
      const farmer = await tx.farmer.update({
        where: { id: user.userId },
        data: farmerUpdateData
      });

      if (body.settings) {
        await tx.farmerSettings.upsert({
          where: { farmerId: user.userId },
          create: {
            farmerId: user.userId,
            ...body.settings
          },
          update: body.settings
        });
      }

      if (body.crops || body.futureCrops) {
        await tx.crop.deleteMany({
          where: { farmerId: user.userId }
        });

        if (body.crops?.length > 0) {
          await tx.crop.createMany({
            data: body.crops.map((crop: Crop) => ({
              farmerId: user.userId,
              name: crop.name,
              isFuture: false,
              status: 'GROWING'
            }))
          });
        }

        if (body.futureCrops?.length > 0) {
          await tx.crop.createMany({
            data: body.futureCrops.map((crop: Crop) => ({
              farmerId: user.userId,
              name: crop.name,
              isFuture: true,
              status: 'PLANTED'
            }))
          });
        }
      }

      return farmer;
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updatedFarmer
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
