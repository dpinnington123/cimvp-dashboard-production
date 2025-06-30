// Configuration for brand profile characteristics

// Predefined qualitative characteristics
export const PROFILE_CHARACTERISTICS = [
  'product_quality',
  'price_point',
  'customer_service',
  'innovation_rate'
] as const;

// Type for characteristic keys
export type ProfileCharacteristic = typeof PROFILE_CHARACTERISTICS[number];

// Human-readable labels for characteristics
export const CHARACTERISTIC_LABELS: Record<ProfileCharacteristic, string> = {
  product_quality: 'Product Quality',
  price_point: 'Price Point',
  customer_service: 'Customer Service',
  innovation_rate: 'Innovation Rate'
};

// Predefined assessment values
export const ASSESSMENT_VALUES = [
  'Excellent',
  'Very Good',
  'Good',
  'Average',
  'Below Average',
  'Poor'
] as const;

// Type for assessment values
export type AssessmentValue = typeof ASSESSMENT_VALUES[number];

// Color coding for assessment values (for UI)
export const ASSESSMENT_COLORS: Record<AssessmentValue, string> = {
  'Excellent': 'text-emerald-700',
  'Very Good': 'text-emerald-600',
  'Good': 'text-green-600',
  'Average': 'text-yellow-600',
  'Below Average': 'text-orange-600',
  'Poor': 'text-red-600'
};

// Default values for new characteristics
export const DEFAULT_ASSESSMENT: AssessmentValue = 'Average';