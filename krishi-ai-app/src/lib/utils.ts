import type { Farmer } from "@/app/api/v1/protected/profile/route"

// checks if a farmer profile has the essentials filled
export function isProfileComplete(profile: Farmer | null | undefined): boolean {
  if (!profile) {
    console.debug('Profile incomplete: No profile data');
    return false;
  }

  // ✅ basic checks: name, email, settings
  const { name, email, settings } = profile;
  
  if (!name?.trim()) {
    console.debug('Profile incomplete: Missing name');
    return false;
  }
  
  if (!email?.trim()) {
    console.debug('Profile incomplete: Missing email');
    return false;
  }
  
  if (!settings) {
    console.debug('Profile incomplete: Missing settings object');
    return false;
  }

  // ✅ location checks
  if (!settings.city?.trim() || !settings.state?.trim()) {
    console.debug('Profile incomplete: Missing city or state');
    return false;
  }

  // ✅ farm details checks
  if (!settings.farmSize || settings.farmSize <= 0) {
    console.debug('Profile incomplete: Invalid farm size');
    return false;
  }
  
  if (!settings.farmType?.trim()) {
    console.debug('Profile incomplete: Missing farm type');
    return false;
  }

  // ✅ organic certification must be explicitly set (boolean)
  if (typeof settings.organicCertified !== "boolean") {
    console.debug('Profile incomplete: Organic certification not set');
    return false;
  }

  // ✅ optional: check if user has at least one crop
  if (!profile.crops || profile.crops.length === 0) {
    console.debug('Profile incomplete: No crops specified');
    return false;
  }

  console.debug('Profile complete: All required fields present');
  return true;
}

// Helper function to get missing fields for better UX
export function getMissingProfileFields(profile: Farmer | null | undefined): string[] {
  const missing: string[] = [];
  
  if (!profile) return ['Complete profile data'];
  
  const { name, email, settings } = profile;
  
  if (!name?.trim()) missing.push('Name');
  if (!email?.trim()) missing.push('Email');
  if (!settings) missing.push('Settings');
  else {
    if (!settings.city?.trim()) missing.push('City');
    if (!settings.state?.trim()) missing.push('State');
    if (!settings.farmSize || settings.farmSize <= 0) missing.push('Farm size');
    if (!settings.farmType?.trim()) missing.push('Farm type');
    if (typeof settings.organicCertified !== "boolean") missing.push('Organic certification');
  }
  
  if (!profile.crops || profile.crops.length === 0) missing.push('At least one crop');
  
  return missing;
}

// Helper function for more flexible checking (if you want to make some fields optional later)
export function isProfileCompleteFlexible(
  profile: Farmer | null | undefined, 
  options: {
    requireCrops?: boolean;
    requireLocation?: boolean;
    requireOrganicCertification?: boolean;
  } = {}
): boolean {
  const {
    requireCrops = true,
    requireLocation = true,
    requireOrganicCertification = true
  } = options;

  if (!profile) return false;

  const { name, email, settings } = profile;
  
  // Core requirements
  if (!name?.trim() || !email?.trim() || !settings) return false;
  if (!settings.farmSize || settings.farmSize <= 0) return false;
  if (!settings.farmType?.trim()) return false;

  // Optional requirements based on config
  if (requireLocation && (!settings.city?.trim() || !settings.state?.trim())) {
    return false;
  }

  if (requireOrganicCertification && typeof settings.organicCertified !== "boolean") {
    return false;
  }

  if (requireCrops && (!profile.crops || profile.crops.length === 0)) {
    return false;
  }

  return true;
}