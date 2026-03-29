import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const farmerProfile = {
    // Farmer Model Fields
    id: "cm1x8y9z0a1b2c3d4e5f6g7h8",
    email: "raj.kumar@email.com",
    name: "Raj Kumar",
    phone: "+91 98765 43210",
    avatar: null,
    createdAt: "2023-01-15T10:30:00.000Z", // Member Since: Jan 2023
    updatedAt: "2024-12-18T14:22:00.000Z",
    
    // FarmerSettings Model Fields
    settings: {
      id: "settings_cm1x8y9z0a1b2c3d4e5f6g7h8",
      
      // Location
      latitude: 18.5204,
      longitude: 73.8567,
      city: "Pune",
      state: "Maharashtra",
      zipCode: "411001",
      country: "IN",
      
      // Contact Preferences
      primaryContact: "EMAIL",
      secondaryContact: "PHONE",
      
      // Locale Settings
      languagePreference: "en", // Will map to "English" in UI
      timezone: "Asia/Kolkata",
      currency: "INR",
      
      // Farm Equipment (missing from UI - could be useful elsewhere)
      equipments: ["tractor", "irrigation_system", "harvester"],
      
      // Farm Details
      farmSize: 7.5, // Will display as "7.5 acres" in UI
      farmType: "MIXED",
      organicCertified: true,
      
      // Notification Preferences
      emailNotifications: true,
      pushNotifications: true,
      weatherAlerts: true,
      marketPriceAlerts: false,
      
      createdAt: "2023-01-15T10:30:00.000Z",
      updatedAt: "2024-12-18T14:20:00.000Z",
      farmerId: "cm1x8y9z0a1b2c3d4e5f6g7h8"
    },
    
    // Crop Model Fields (current active crops)
    crops: [
      {
        id: "crop_wheat_001",
        name: "Wheat",
        variety: "HD-2967",
        plantedDate: "2024-11-01T00:00:00.000Z",
        harvestDate: null,
        quantity: null,
        status: "GROWING",
        notes: "Good germination rate",
        farmerId: "cm1x8y9z0a1b2c3d4e5f6g7h8",
        createdAt: "2024-11-01T08:30:00.000Z",
        updatedAt: "2024-12-01T10:15:00.000Z"
      },
      {
        id: "crop_rice_001",
        name: "Rice",
        variety: "Basmati-385",
        plantedDate: "2024-06-15T00:00:00.000Z",
        harvestDate: "2024-10-20T00:00:00.000Z",
        quantity: 2500.0,
        status: "HARVESTED",
        notes: "Excellent yield this season",
        farmerId: "cm1x8y9z0a1b2c3d4e5f6g7h8",
        createdAt: "2024-06-15T09:00:00.000Z",
        updatedAt: "2024-10-20T16:30:00.000Z"
      },
      {
        id: "crop_maize_001",
        name: "Maize",
        variety: "NK-6240",
        plantedDate: "2024-07-10T00:00:00.000Z",
        harvestDate: null,
        quantity: null,
        status: "READY_FOR_HARVEST",
        notes: "Ready for harvest next week",
        farmerId: "cm1x8y9z0a1b2c3d4e5f6g7h8",
        createdAt: "2024-07-10T07:45:00.000Z",
        updatedAt: "2024-12-15T11:20:00.000Z"
      }
    ],
    
    // Additional UI-specific fields (not in DB models)
    lastSync: "2 hours", // This would be calculated from updatedAt
    syncStatus: true, // This would be calculated based on last API call success
  }

  return NextResponse.json(farmerProfile);
}
