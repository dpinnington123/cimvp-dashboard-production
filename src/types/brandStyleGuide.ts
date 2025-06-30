// Brand Style Guide type definitions

export interface BrandStyleGuide {
  name: string;
  voice: {
    tone: string[];
    personality: string[];
    keywords: string[];
    description: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutrals: string[];
    meaning: string;
  };
  fonts: {
    heading: {
      family: string;
      weight: string;
      size: string;
    };
    body: {
      family: string;
      weight: string;
      size: string;
    };
    special: {
      family: string;
      weight: string;
      size: string;
      usage: string;
    };
  };
  imagery: {
    style: string[];
    subjects: string[];
    avoid: string[];
    filters: string;
    guidelines: string;
  };
  logo: {
    primary: string | null;
    variations: string[];
    usage: string;
    clearSpace: string;
    minSize: string;
  };
  requirements: {
    dos: string[];
    donts: string[];
    guidelines: string;
  };
}