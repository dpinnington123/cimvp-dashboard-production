// src/data/brandData.ts
// Centralized data structure for brands

import { randomUUID } from 'crypto';

// Type definitions for brand data
export interface BrandProfile {
  id: string;
  name: string;
  logo?: string; // URL to logo image
  region: string;
  businessArea: string;
  financials: {
    annualSales: string;
    targetSales: string;
    growth: string;
  };
}

export interface BrandVoice {
  id: string;
  title: string;
  description: string;
}

export interface BrandObjective {
  id: string;
  text: string;
  notes: string;
}

export interface BrandMessage {
  id: string;
  text: string;
  notes: string;
}

export interface BrandAudience {
  id: string;
  text: string;
  notes: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  score: number;
}

export interface Campaign {
  name: string;
  scores: {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  };
  status: 'active' | 'planned' | 'completed';
  timeframe: string;
}

export interface ContentItem {
  id: string;
  name: string;
  campaign: string;
  format: string;
  type: "hero" | "driver";
  status: "draft" | "live";
  scores: {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  };
}

export interface ChannelScores {
  overall: number;
  strategic: number;
  customer: number;
  execution: number;
}

export interface FunnelStep {
  name: string;
  value: number;
}

export interface BrandData {
  profile: BrandProfile;
  voice: BrandVoice[];
  objectives: BrandObjective[];
  messages: BrandMessage[];
  audiences: BrandAudience[];
  strategies: Strategy[];
  campaigns: Campaign[];
  content: ContentItem[];
  overallScores: {
    overall: number;
    strategic: number;
    customer: number;
    content: number;
  };
  channelScores: {
    social: ChannelScores;
    email: ChannelScores;
    website: ChannelScores;
    digital: ChannelScores;
  };
  funnelData: FunnelStep[];
  marketAnalysis?: {
    // Additional data for market analysis page
    marketSize: string;
    growthRate: string;
    competitorAnalysis: Array<{
      name: string;
      marketShare: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };
  customerAnalysis?: {
    // Additional data for customer analysis page
    segments: Array<{
      name: string;
      size: string;
      description: string;
      needs: string[];
      painPoints: string[];
    }>;
    customerJourney: Array<{
      stage: string;
      touchpoints: string[];
      opportunities: string[];
    }>;
  };
}

// Create data for three distinct brands
export const brandsData: Record<string, BrandData> = {
  "EcoSolutions": {
    profile: {
      id: "eco-solutions",
      name: "EcoSolutions",
      region: "North America",
      businessArea: "Sustainable Consumer Products",
      financials: {
        annualSales: "$38.5M",
        targetSales: "$50M",
        growth: "15.2%"
      }
    },
    voice: [
      { id: "es-voice-1", title: "Confident and authoritative", description: "Establishing expertise in sustainability" },
      { id: "es-voice-2", title: "Approachable and friendly", description: "Creating connection with eco-conscious consumers" },
      { id: "es-voice-3", title: "Clear and straightforward", description: "Communicating benefits without greenwashing" },
      { id: "es-voice-4", title: "Inspiring and motivational", description: "Encouraging sustainable lifestyle choices" }
    ],
    objectives: [
      { id: "es-obj-1", text: "Increase brand awareness by 30%", notes: "Focus on digital channels and sustainability influencers" },
      { id: "es-obj-2", text: "Expand product line by 5 new items", notes: "Target zero-waste household essentials" },
      { id: "es-obj-3", text: "Reduce carbon footprint by 25%", notes: "Implement across supply chain and highlight in marketing" }
    ],
    messages: [
      { id: "es-msg-1", text: "Planet-friendly innovation", notes: "Emphasize research and development of sustainable materials" },
      { id: "es-msg-2", text: "Affordable sustainability", notes: "Counter perception that eco-friendly equals expensive" },
      { id: "es-msg-3", text: "Small changes, big impact", notes: "Show how small consumer choices add up to significant change" }
    ],
    audiences: [
      { id: "es-aud-1", text: "Eco-conscious Millennials", notes: "Urban, educated, income >$65k, values-driven purchasing" },
      { id: "es-aud-2", text: "Sustainability-curious families", notes: "Suburban, seeking practical ways to be more eco-friendly" },
      { id: "es-aud-3", text: "Corporate procurement teams", notes: "Looking to improve corporate sustainability metrics" }
    ],
    strategies: [
      {
        id: "es-strategy-1",
        name: "Zero-Waste Leadership",
        description: "Position as the leading zero-waste consumer brand through product innovation and educational content",
        score: 85
      },
      {
        id: "es-strategy-2",
        name: "Digital-First Education",
        description: "Use digital channels to educate consumers on sustainability practices while showcasing products",
        score: 78
      },
      {
        id: "es-strategy-3",
        name: "Community Building",
        description: "Create a community of eco-conscious consumers who advocate for the brand and sustainability",
        score: 82
      }
    ],
    campaigns: [
      {
        name: "Earth Month Awareness",
        scores: {
          overall: 83,
          strategic: 86,
          customer: 80,
          execution: 84
        },
        status: "active",
        timeframe: "Mar 15 - Apr 30, 2023"
      },
      {
        name: "Zero-Waste Challenge",
        scores: {
          overall: 79,
          strategic: 85,
          customer: 82,
          execution: 70
        },
        status: "active",
        timeframe: "Feb 01 - Jun 30, 2023"
      },
      {
        name: "Holiday Gift Guide: Sustainable Edition",
        scores: {
          overall: 75,
          strategic: 92,
          customer: 78,
          execution: 0
        },
        status: "planned",
        timeframe: "Oct 15 - Dec 25, 2023"
      }
    ],
    content: [
      {
        id: "es-content-1",
        name: "Plastic-Free Kitchen Guide",
        campaign: "Zero-Waste Challenge",
        format: "Blog Content",
        type: "hero",
        status: "live",
        scores: {
          overall: 86,
          strategic: 90,
          customer: 88,
          execution: 80
        }
      },
      {
        id: "es-content-2",
        name: "Meet Our Suppliers Instagram Series",
        campaign: "Earth Month Awareness",
        format: "Social Media",
        type: "driver",
        status: "live",
        scores: {
          overall: 84,
          strategic: 87,
          customer: 88,
          execution: 77
        }
      },
      {
        id: "es-content-3",
        name: "Sustainable Gift Ideas Video",
        campaign: "Holiday Gift Guide: Sustainable Edition",
        format: "Video",
        type: "hero",
        status: "draft",
        scores: {
          overall: 73,
          strategic: 85,
          customer: 80,
          execution: 60
        }
      }
    ],
    overallScores: {
      overall: 81,
      strategic: 88,
      customer: 79,
      content: 76
    },
    channelScores: {
      social: {
        overall: 85,
        strategic: 88,
        customer: 90,
        execution: 78
      },
      email: {
        overall: 79,
        strategic: 82,
        customer: 76,
        execution: 78
      },
      website: {
        overall: 80,
        strategic: 73,
        customer: 85,
        execution: 81
      },
      digital: {
        overall: 83,
        strategic: 80,
        customer: 76,
        execution: 90
      }
    },
    funnelData: [
      { name: "Awareness to Consider", value: 82 },
      { name: "Consider to Purchase", value: 68 },
      { name: "Purchase to Growth", value: 58 }
    ],
    marketAnalysis: {
      marketSize: "$4.6 Billion",
      growthRate: "12.3% CAGR",
      competitorAnalysis: [
        {
          name: "GreenLife",
          marketShare: "18%",
          strengths: ["Strong retail presence", "Wide product range"],
          weaknesses: ["Higher price point", "Less digital engagement"]
        },
        {
          name: "EarthWise",
          marketShare: "15%",
          strengths: ["Strong brand recognition", "Celebrity endorsements"],
          weaknesses: ["Limited product innovation", "Supply chain issues"]
        }
      ],
      swot: {
        strengths: ["Product innovation", "Transparent supply chain", "Strong digital presence"],
        weaknesses: ["Limited retail distribution", "Lower brand awareness", "Manufacturing capacity"],
        opportunities: ["Growing eco-conscious market", "Corporate partnerships", "International expansion"],
        threats: ["Price competition", "Greenwashing by competitors", "Raw material costs"]
      }
    },
    customerAnalysis: {
      segments: [
        {
          name: "Eco Enthusiasts",
          size: "35%",
          description: "Deeply committed to sustainable lifestyle",
          needs: ["Product efficacy", "Zero waste", "Transparent sourcing"],
          painPoints: ["Price sensitivity", "Greenwashing concerns", "Availability"]
        },
        {
          name: "Green Curious",
          size: "45%",
          description: "Interested in sustainability but pragmatic",
          needs: ["Ease of use", "Value for money", "Educational content"],
          painPoints: ["Confusion about benefits", "Effort required", "Skepticism"]
        }
      ],
      customerJourney: [
        {
          stage: "Awareness",
          touchpoints: ["Social media", "Influencer content", "Search"],
          opportunities: ["Educational content", "Social proof", "Problem framing"]
        },
        {
          stage: "Consideration",
          touchpoints: ["Website", "Reviews", "Comparison content"],
          opportunities: ["Clear value proposition", "Sustainability metrics", "Use cases"]
        },
        {
          stage: "Purchase",
          touchpoints: ["E-commerce", "Retail partners", "Direct sales"],
          opportunities: ["Simplified checkout", "Bundle offerings", "Subscription options"]
        }
      ]
    }
  },
  "TechNova": {
    profile: {
      id: "tech-nova",
      name: "TechNova",
      region: "Global",
      businessArea: "Consumer Electronics & Software",
      financials: {
        annualSales: "$173M",
        targetSales: "$220M",
        growth: "22.8%"
      }
    },
    voice: [
      { id: "tn-voice-1", title: "Innovative and forward-thinking", description: "Positioning as technology leaders" },
      { id: "tn-voice-2", title: "Simple and accessible", description: "Making complex technology understandable" },
      { id: "tn-voice-3", title: "Trusted and reliable", description: "Building confidence in our solutions" },
      { id: "tn-voice-4", title: "Personal and helpful", description: "Focusing on how technology improves lives" }
    ],
    objectives: [
      { id: "tn-obj-1", text: "Increase market share by 15%", notes: "Focus on emerging markets and new user demographics" },
      { id: "tn-obj-2", text: "Launch 3 new product lines", notes: "Target wearable tech, smart home, and AR experiences" },
      { id: "tn-obj-3", text: "Achieve 40% subscription-based revenue", notes: "Transition from one-time purchases to recurring revenue" }
    ],
    messages: [
      { id: "tn-msg-1", text: "Technology that understands you", notes: "Emphasize AI and personalization capabilities" },
      { id: "tn-msg-2", text: "Seamless integration for modern life", notes: "Focus on ecosystem and interoperability" },
      { id: "tn-msg-3", text: "Innovation with purpose", notes: "Highlight meaningful benefits rather than specs" }
    ],
    audiences: [
      { id: "tn-aud-1", text: "Tech Professionals (28-45)", notes: "Urban, early adopters, high disposable income" },
      { id: "tn-aud-2", text: "Digital Families", notes: "Suburban, tech-integrated households, convenience-focused" },
      { id: "tn-aud-3", text: "Small Business Owners", notes: "Seeking productivity and efficiency solutions" }
    ],
    strategies: [
      {
        id: "tn-strategy-1",
        name: "Ecosystem Expansion",
        description: "Build a comprehensive product ecosystem that creates lock-in and increases customer lifetime value",
        score: 88
      },
      {
        id: "tn-strategy-2",
        name: "AI-First Innovation",
        description: "Integrate artificial intelligence across all products to create personalized user experiences",
        score: 92
      },
      {
        id: "tn-strategy-3",
        name: "Subscription Transformation",
        description: "Transform business model from hardware sales to recurring service subscriptions",
        score: 76
      }
    ],
    campaigns: [
      {
        name: "Next Gen Product Launch",
        scores: {
          overall: 91,
          strategic: 94,
          customer: 89,
          execution: 90
        },
        status: "active",
        timeframe: "May 01 - Jul 15, 2023"
      },
      {
        name: "Work From Anywhere",
        scores: {
          overall: 83,
          strategic: 85,
          customer: 87,
          execution: 78
        },
        status: "active",
        timeframe: "Jan 20 - Dec 31, 2023"
      },
      {
        name: "Smart Home Essentials",
        scores: {
          overall: 78,
          strategic: 80,
          customer: 82,
          execution: 0
        },
        status: "planned",
        timeframe: "Sep 01 - Nov 30, 2023"
      }
    ],
    content: [
      {
        id: "tn-content-1",
        name: "Product Keynote Presentation",
        campaign: "Next Gen Product Launch",
        format: "Video",
        type: "hero",
        status: "live",
        scores: {
          overall: 93,
          strategic: 95,
          customer: 90,
          execution: 92
        }
      },
      {
        id: "tn-content-2",
        name: "Productivity Tips Series",
        campaign: "Work From Anywhere",
        format: "Social Media",
        type: "driver",
        status: "live",
        scores: {
          overall: 85,
          strategic: 82,
          customer: 90,
          execution: 83
        }
      },
      {
        id: "tn-content-3",
        name: "Smart Home Setup Guide",
        campaign: "Smart Home Essentials",
        format: "Blog Content",
        type: "hero",
        status: "draft",
        scores: {
          overall: 76,
          strategic: 80,
          customer: 85,
          execution: 65
        }
      }
    ],
    overallScores: {
      overall: 87,
      strategic: 92,
      customer: 85,
      content: 84
    },
    channelScores: {
      social: {
        overall: 84,
        strategic: 86,
        customer: 90,
        execution: 78
      },
      email: {
        overall: 80,
        strategic: 85,
        customer: 78,
        execution: 76
      },
      website: {
        overall: 91,
        strategic: 90,
        customer: 88,
        execution: 94
      },
      digital: {
        overall: 88,
        strategic: 92,
        customer: 85,
        execution: 86
      }
    },
    funnelData: [
      { name: "Awareness to Consider", value: 86 },
      { name: "Consider to Purchase", value: 72 },
      { name: "Purchase to Growth", value: 65 }
    ],
    marketAnalysis: {
      marketSize: "$1.2 Trillion",
      growthRate: "8.5% CAGR",
      competitorAnalysis: [
        {
          name: "ApexTech",
          marketShare: "32%",
          strengths: ["Brand loyalty", "Vertical integration", "Large R&D budget"],
          weaknesses: ["Premium pricing", "Closed ecosystem", "Slower innovation cycles"]
        },
        {
          name: "NextWave",
          marketShare: "24%",
          strengths: ["Competitive pricing", "Fast innovation", "Market reach"],
          weaknesses: ["Quality inconsistency", "Brand perception", "Service infrastructure"]
        }
      ],
      swot: {
        strengths: ["AI expertise", "Product design", "Customer experience", "Software integration"],
        weaknesses: ["Market recognition", "Limited retail presence", "Hardware margins"],
        opportunities: ["IoT growth", "Remote work trends", "Subscription services", "Voice interfaces"],
        threats: ["Big tech competition", "Hardware commoditization", "Regulatory changes", "Supply chain disruption"]
      }
    },
    customerAnalysis: {
      segments: [
        {
          name: "Power Users",
          size: "25%",
          description: "Technology enthusiasts who value cutting-edge features",
          needs: ["Performance", "Innovation", "Customization", "Integration"],
          painPoints: ["Compatibility issues", "Short upgrade cycles", "Price vs. value"]
        },
        {
          name: "Convenience Seekers",
          size: "40%",
          description: "Value simplicity and seamless technology experiences",
          needs: ["Ease of use", "Reliability", "Customer support"],
          painPoints: ["Tech complexity", "Setup difficulties", "Privacy concerns"]
        },
        {
          name: "Professional Creators",
          size: "15%",
          description: "Use technology for professional creative work",
          needs: ["Performance", "Reliability", "Specialized features"],
          painPoints: ["Software limitations", "Learning curve", "Cross-platform workflows"]
        }
      ],
      customerJourney: [
        {
          stage: "Awareness",
          touchpoints: ["Tech media", "Review sites", "Social platforms", "Influencers"],
          opportunities: ["Thought leadership", "Innovation storytelling", "Problem identification"]
        },
        {
          stage: "Consideration",
          touchpoints: ["Product comparisons", "Demo videos", "Community forums"],
          opportunities: ["Interactive demos", "Use case scenarios", "Expert endorsements"]
        },
        {
          stage: "Purchase",
          touchpoints: ["E-commerce", "Premium retail", "Direct sales"],
          opportunities: ["Simplified configuration", "Trade-in programs", "Bundling options"]
        }
      ]
    }
  },
  "VitalWellness": {
    profile: {
      id: "vital-wellness",
      name: "VitalWellness",
      region: "Europe",
      businessArea: "Health & Wellness Products",
      financials: {
        annualSales: "$87.2M",
        targetSales: "$110M",
        growth: "18.5%"
      }
    },
    voice: [
      { id: "vw-voice-1", title: "Nurturing and supportive", description: "Creating a sense of care and guidance" },
      { id: "vw-voice-2", title: "Scientific and evidence-based", description: "Building trust through research and expertise" },
      { id: "vw-voice-3", title: "Uplifting and positive", description: "Inspiring healthy change through optimism" },
      { id: "vw-voice-4", title: "Authentic and transparent", description: "Being honest about products and benefits" }
    ],
    objectives: [
      { id: "vw-obj-1", text: "Enter 3 new European markets", notes: "Focus on Nordics and Mediterranean regions" },
      { id: "vw-obj-2", text: "Increase direct-to-consumer sales by 40%", notes: "Reduce dependency on retail partners" },
      { id: "vw-obj-3", text: "Develop personalized wellness programs", notes: "Create app integration with product line" }
    ],
    messages: [
      { id: "vw-msg-1", text: "Science-backed wellness", notes: "Highlight clinical studies and research partnerships" },
      { id: "vw-msg-2", text: "Personalized health journeys", notes: "Emphasize customization to individual needs" },
      { id: "vw-msg-3", text: "Holistic wellbeing", notes: "Connect physical products to mental and emotional health" }
    ],
    audiences: [
      { id: "vw-aud-1", text: "Health-Conscious Professionals (30-55)", notes: "Urban, high-stress, seeking preventative health solutions" },
      { id: "vw-aud-2", text: "Active Seniors (55+)", notes: "Health-focused, disposable income, wellness lifestyle" },
      { id: "vw-aud-3", text: "Fitness Enthusiasts", notes: "Performance-oriented, tech-savvy, community-driven" }
    ],
    strategies: [
      {
        id: "vw-strategy-1",
        name: "Personalized Wellness",
        description: "Create personalized health experiences through digital tools and custom product recommendations",
        score: 84
      },
      {
        id: "vw-strategy-2",
        name: "Clinical Credibility",
        description: "Build brand authority through scientific research partnerships and clinical validation",
        score: 79
      },
      {
        id: "vw-strategy-3",
        name: "Community Health",
        description: "Develop supportive communities around specific health interests and product categories",
        score: 86
      }
    ],
    campaigns: [
      {
        name: "Sleep Revolution",
        scores: {
          overall: 85,
          strategic: 82,
          customer: 90,
          execution: 83
        },
        status: "active",
        timeframe: "Feb 10 - Aug 31, 2023"
      },
      {
        name: "Immune Health Awareness",
        scores: {
          overall: 80,
          strategic: 78,
          customer: 83,
          execution: 78
        },
        status: "active",
        timeframe: "Sep 15 - Mar 31, 2024"
      },
      {
        name: "Active Aging Initiative",
        scores: {
          overall: 77,
          strategic: 85,
          customer: 82,
          execution: 0
        },
        status: "planned",
        timeframe: "Nov 01 - Feb 28, 2024"
      }
    ],
    content: [
      {
        id: "vw-content-1",
        name: "Sleep Science Webinar Series",
        campaign: "Sleep Revolution",
        format: "Video",
        type: "hero",
        status: "live",
        scores: {
          overall: 87,
          strategic: 85,
          customer: 92,
          execution: 84
        }
      },
      {
        id: "vw-content-2",
        name: "Immunity Boosting Recipe Guide",
        campaign: "Immune Health Awareness",
        format: "Content",
        type: "driver",
        status: "live",
        scores: {
          overall: 82,
          strategic: 78,
          customer: 88,
          execution: 80
        }
      },
      {
        id: "vw-content-3",
        name: "Fitness After 50 Video Series",
        campaign: "Active Aging Initiative",
        format: "Video",
        type: "hero",
        status: "draft",
        scores: {
          overall: 75,
          strategic: 82,
          customer: 85,
          execution: 65
        }
      }
    ],
    overallScores: {
      overall: 83,
      strategic: 80,
      customer: 88,
      content: 81
    },
    channelScores: {
      social: {
        overall: 80,
        strategic: 78,
        customer: 86,
        execution: 78
      },
      email: {
        overall: 85,
        strategic: 82,
        customer: 89,
        execution: 85
      },
      website: {
        overall: 84,
        strategic: 80,
        customer: 86,
        execution: 87
      },
      digital: {
        overall: 79,
        strategic: 76,
        customer: 84,
        execution: 78
      }
    },
    funnelData: [
      { name: "Awareness to Consider", value: 75 },
      { name: "Consider to Purchase", value: 68 },
      { name: "Purchase to Growth", value: 72 }
    ],
    marketAnalysis: {
      marketSize: "$280 Billion",
      growthRate: "7.2% CAGR",
      competitorAnalysis: [
        {
          name: "WellLife",
          marketShare: "20%",
          strengths: ["Retail distribution", "Product range breadth", "Brand recognition"],
          weaknesses: ["Digital presence", "Premium positioning", "Product innovation"]
        },
        {
          name: "HealthFirst",
          marketShare: "15%",
          strengths: ["Medical credibility", "Research partnerships", "Targeted solutions"],
          weaknesses: ["Limited market reach", "Higher price point", "Marketing effectiveness"]
        }
      ],
      swot: {
        strengths: ["Product efficacy", "Scientific backing", "Customer loyalty", "Digital experience"],
        weaknesses: ["Brand awareness", "Regional limitations", "Production scalability"],
        opportunities: ["Aging population", "Preventative health trends", "Digital health integration", "Subscription models"],
        threats: ["Regulatory changes", "Low-cost competitors", "Market consolidation", "Claims scrutiny"]
      }
    },
    customerAnalysis: {
      segments: [
        {
          name: "Proactive Preventers",
          size: "30%",
          description: "Focus on prevention and long-term health maintenance",
          needs: ["Scientific validity", "Education", "Quality assurance", "Holistic solutions"],
          painPoints: ["Information overload", "Result visibility", "Time commitment"]
        },
        {
          name: "Performance Optimizers",
          size: "25%",
          description: "Seeking to enhance specific aspects of health performance",
          needs: ["Measurable results", "Specialized solutions", "Expert guidance"],
          painPoints: ["Result plateau", "Product integration", "Conflicting information"]
        },
        {
          name: "Wellness Lifestylers",
          size: "35%",
          description: "View health as part of overall lifestyle and identity",
          needs: ["Brand alignment", "Community connection", "Discovery", "Experiential value"],
          painPoints: ["Authenticity concerns", "Value demonstration", "Lifestyle integration"]
        }
      ],
      customerJourney: [
        {
          stage: "Awareness",
          touchpoints: ["Health content", "Social media", "Professional recommendations", "Symptom searches"],
          opportunities: ["Educational content", "Expert partnerships", "Problem-focused marketing"]
        },
        {
          stage: "Consideration",
          touchpoints: ["Product research", "Reviews", "Comparison content", "Community forums"],
          opportunities: ["Science visualization", "Testimonials", "Interactive tools", "Free assessments"]
        },
        {
          stage: "Purchase",
          touchpoints: ["E-commerce", "Health retailers", "Subscription programs"],
          opportunities: ["Personalized recommendations", "Starter kits", "Risk-free trials"]
        }
      ]
    }
  }
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