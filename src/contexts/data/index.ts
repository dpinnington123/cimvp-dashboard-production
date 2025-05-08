// src/data/index.ts
// Centralized export for brand data

import type { BrandData } from '../../types/brand';
import { ecoSolutionsData } from './brands/ecoSolutions';
import { techNovaData } from './brands/techNova';
import { vitalWellnessData } from './brands/vitalWellness';

// Combine data for all brands
export const brandsData: Record<string, BrandData> = {
  "EcoSolutions": ecoSolutionsData,
  "TechNova": techNovaData,
  "VitalWellness": vitalWellnessData,
};

// Export an array of brand names for selection in UI
export const brandNames = Object.keys(brandsData);

// Export an array of regions for selection in UI
export const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
  "Global",
]; 