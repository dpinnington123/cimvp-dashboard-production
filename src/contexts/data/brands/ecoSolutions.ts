// src/data/brands/ecoSolutions.ts
// Data for the EcoSolutions brand

import type { BrandData } from '../../../types/brand';

export const ecoSolutionsData: BrandData = {
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
      timeframe: "Mar 15 - Apr 30, 2023",
      strategicObjective: "Position EcoSolutions as a thought leader in sustainable living during Earth Month, increasing brand awareness by 25% and driving a 15% increase in website traffic.",
      audience: "Eco-conscious Millennials and Gen Z consumers with interest in sustainable living practices and products.",
      keyActions: [
        "Develop comprehensive social media campaign across Instagram, Facebook, and Twitter",
        "Partner with 5 sustainability influencers for content creation",
        "Host 3 virtual workshops on sustainable living practices",
        "Create Earth Month landing page with daily tips and product recommendations"
      ],
      campaignDetails: "Earth Month Awareness is our annual flagship campaign targeting environmentally conscious consumers during April's Earth Month celebrations. The campaign focuses on educational content that establishes brand authority while subtly showcasing our products in real-world sustainability applications.",
      agencies: ["GreenMedia Partners", "EcoInfluence Collective"],
      budget: 75000
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
      timeframe: "Feb 01 - Jun 30, 2023",
      strategicObjective: "Drive product adoption through a community-based challenge program that educates consumers on zero-waste practices while demonstrating how our products facilitate sustainable living.",
      audience: "Sustainability-curious families and individuals looking to reduce household waste with practical, affordable solutions.",
      keyActions: [
        "Launch 30-day Zero-Waste Challenge program with daily tasks and goals",
        "Create challenge toolkit with printable resources and tracking sheets",
        "Develop weekly email sequence with progress markers and product recommendations",
        "Establish community forum for participants to share experiences and tips"
      ],
      campaignDetails: "The Zero-Waste Challenge transforms sustainable living from aspiration to action through a structured program that guides participants through increasingly impactful zero-waste practices. The challenge format creates community engagement while naturally positioning our products as essential tools for success.",
      agencies: ["BehaviorChange Co", "Digital Engagement Lab"],
      budget: 95000
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
      timeframe: "Oct 15 - Dec 25, 2023",
      strategicObjective: "Capitalize on holiday shopping season to position EcoSolutions products as meaningful, sustainable gifts that align with consumers' environmental values.",
      audience: "Environmentally-conscious gift-givers seeking alternatives to traditional consumer products, with focus on 28-45 age demographic.",
      keyActions: [
        "Create segmented gift guides based on recipient types (Eco-Curious, Zero-Waste Expert, etc.)",
        "Develop 'Gift of Sustainability' themed messaging across all channels",
        "Implement bundle promotions of complementary sustainable products",
        "Launch targeted email campaign highlighting sustainable gift alternatives"
      ],
      campaignDetails: "The Sustainable Holiday Gift Guide reimagines holiday gifting through an environmental lens, offering consumers a way to maintain traditions while aligning with sustainability values. This campaign addresses the heightened consumption of the holiday season with thoughtful alternatives.",
      agencies: ["Season Shift Creative", "Green Retail Consultants"],
      budget: 65000
    }
  ],
  content: [
    {
      id: "es-content-1",
      name: "Sustainable Living Tips Series",
      campaign: "Earth Month Awareness",
      format: "Social Media",
      type: "driver",
      status: "live",
      scores: {
        overall: 86,
        strategic: 88,
        customer: 90,
        execution: 80
      },
      description: "Daily social media posts featuring actionable sustainable living tips with product integration",
      qualityScore: 88,
      cost: 4500,
      campaignScores: {
        overallEffectiveness: 85,
        strategicAlignment: 88,
        customerAlignment: 90,
        contentEffectiveness: 82
      },
      audience: "Eco-conscious Millennials and Gen Z",
      keyActions: ["Create 30 unique sustainable living tips", "Design templates with brand identity", "Schedule daily posts across platforms"],
      agencies: ["GreenMedia Partners"]
    },
    {
      id: "es-content-2",
      name: "Earth Month Sustainable Brand Newsletter",
      campaign: "Earth Month Awareness",
      format: "Email",
      type: "hero",
      status: "live",
      scores: {
        overall: 84,
        strategic: 90,
        customer: 82,
        execution: 80
      },
      description: "Weekly newsletter highlighting sustainability initiatives, product spotlights, and community actions",
      qualityScore: 85,
      cost: 6200,
      campaignScores: {
        overallEffectiveness: 83,
        strategicAlignment: 90,
        customerAlignment: 81,
        contentEffectiveness: 78
      },
      audience: "Existing customers and newsletter subscribers",
      keyActions: ["Develop 4 themed newsletter templates", "Segment audience for targeted content", "Include customer sustainability stories"],
      agencies: ["EcoInfluence Collective"]
    },
    {
      id: "es-content-3",
      name: "Sustainability Expert Interview Series",
      campaign: "Earth Month Awareness",
      format: "Blog Post",
      type: "driver",
      status: "live",
      scores: {
        overall: 89,
        strategic: 92,
        customer: 86,
        execution: 88
      },
      description: "Weekly interviews with sustainability experts on various environmental topics",
      qualityScore: 91,
      cost: 8000,
      campaignScores: {
        overallEffectiveness: 88,
        strategicAlignment: 91,
        customerAlignment: 85,
        contentEffectiveness: 87
      },
      audience: "Eco-conscious Millennials and environmentally engaged professionals",
      keyActions: ["Identify and schedule 4 diverse sustainability experts", "Prepare in-depth interview questions", "Create accompanying graphics"],
      agencies: ["GreenMedia Partners"]
    },
    {
      id: "es-content-4",
      name: "Earth Month Pledge Campaign",
      campaign: "Earth Month Awareness",
      format: "Social Media",
      type: "hero",
      status: "live",
      scores: {
        overall: 92,
        strategic: 94,
        customer: 95,
        execution: 88
      },
      description: "Interactive social campaign encouraging followers to make and share sustainability pledges",
      qualityScore: 93,
      cost: 9500,
      campaignScores: {
        overallEffectiveness: 91,
        strategicAlignment: 93,
        customerAlignment: 94,
        contentEffectiveness: 86
      },
      audience: "Social media followers across demographics",
      keyActions: ["Develop shareable pledge templates", "Create branded hashtag", "Engage with participant content"],
      agencies: ["EcoInfluence Collective"]
    },
    {
      id: "es-content-5",
      name: "Sustainable Product Impact Report",
      campaign: "Earth Month Awareness",
      format: "Blog Post",
      type: "driver",
      status: "draft",
      scores: {
        overall: 81,
        strategic: 85,
        customer: 78,
        execution: 79
      },
      description: "Detailed report on the environmental impact of EcoSolutions products with transparent metrics",
      qualityScore: 84,
      cost: 7200,
      campaignScores: {
        overallEffectiveness: 80,
        strategicAlignment: 85,
        customerAlignment: 77,
        contentEffectiveness: 78
      },
      audience: "Environmentally conscious consumers seeking product transparency",
      keyActions: ["Compile product environmental impact data", "Create compelling data visualizations", "Include third-party certifications"],
      agencies: ["GreenMedia Partners"]
    },
    {
      id: "es-content-6",
      name: "30-Day Zero-Waste Challenge Guide",
      campaign: "Zero-Waste Challenge",
      format: "Blog Post",
      type: "hero",
      status: "live",
      scores: {
        overall: 88,
        strategic: 91,
        customer: 92,
        execution: 82
      },
      description: "Comprehensive guide outlining the 30-day zero-waste challenge with daily activities and goals",
      qualityScore: 90,
      cost: 6800,
      campaignScores: {
        overallEffectiveness: 87,
        strategicAlignment: 90,
        customerAlignment: 91,
        contentEffectiveness: 81
      },
      audience: "Sustainability-curious families and individuals",
      keyActions: ["Develop 30 progressive zero-waste activities", "Create printable tracking calendar", "Include product recommendations for each challenge"],
      agencies: ["BehaviorChange Co"]
    },
    {
      id: "es-content-7",
      name: "Zero-Waste Challenge Email Sequence",
      campaign: "Zero-Waste Challenge",
      format: "Email",
      type: "driver",
      status: "live",
      scores: {
        overall: 85,
        strategic: 88,
        customer: 90,
        execution: 80
      },
      description: "Automated email sequence delivering daily challenge instructions, tips, and encouragement",
      qualityScore: 87,
      cost: 5500,
      campaignScores: {
        overallEffectiveness: 84,
        strategicAlignment: 87,
        customerAlignment: 89,
        contentEffectiveness: 79
      },
      audience: "Challenge participants across demographics",
      keyActions: ["Develop 30 unique email templates", "Set up automated delivery sequence", "Include personalization elements"],
      agencies: ["Digital Engagement Lab"]
    },
    {
      id: "es-content-8",
      name: "Zero-Waste Success Stories",
      campaign: "Zero-Waste Challenge",
      format: "Blog Post",
      type: "driver",
      status: "draft",
      scores: {
        overall: 82,
        strategic: 86,
        customer: 89,
        execution: 78
      },
      description: "Featured stories from challenge participants sharing their zero-waste journey successes",
      qualityScore: 85,
      cost: 4800,
      campaignScores: {
        overallEffectiveness: 81,
        strategicAlignment: 85,
        customerAlignment: 88,
        contentEffectiveness: 77
      },
      audience: "Challenge participants and sustainability-curious consumers",
      keyActions: ["Collect participant testimonials and photos", "Edit stories for maximum impact", "Feature diverse participants and scenarios"],
      agencies: ["BehaviorChange Co"]
    },
    {
      id: "es-content-9",
      name: "Zero-Waste Challenge Community Forum",
      campaign: "Zero-Waste Challenge",
      format: "Social Media",
      type: "hero",
      status: "live",
      scores: {
        overall: 90,
        strategic: 87,
        customer: 95,
        execution: 88
      },
      description: "Moderated online community where challenge participants can share tips, ask questions, and connect",
      qualityScore: 92,
      cost: 7800,
      campaignScores: {
        overallEffectiveness: 89,
        strategicAlignment: 86,
        customerAlignment: 94,
        contentEffectiveness: 87
      },
      audience: "Challenge participants seeking community support",
      keyActions: ["Set up dedicated community platform", "Develop conversation prompts", "Recruit and train community moderators"],
      agencies: ["Digital Engagement Lab"]
    },
    {
      id: "es-content-10",
      name: "Zero-Waste Product Transition Guides",
      campaign: "Zero-Waste Challenge",
      format: "Email",
      type: "driver",
      status: "draft",
      scores: {
        overall: 80,
        strategic: 84,
        customer: 86,
        execution: 75
      },
      description: "Category-specific guides for transitioning from conventional to zero-waste products",
      qualityScore: 83,
      cost: 4200,
      campaignScores: {
        overallEffectiveness: 79,
        strategicAlignment: 83,
        customerAlignment: 85,
        contentEffectiveness: 74
      },
      audience: "Sustainability-curious families and individuals",
      keyActions: ["Develop guides for kitchen, bathroom, office, etc.", "Include cost comparison data", "Feature relevant product recommendations"],
      agencies: ["BehaviorChange Co"]
    },
    {
      id: "es-content-11",
      name: "Sustainable Holiday Gift Guide",
      campaign: "Holiday Gift Guide: Sustainable Edition",
      format: "Blog Post",
      type: "hero",
      status: "draft",
      scores: {
        overall: 86,
        strategic: 90,
        customer: 88,
        execution: 80
      },
      description: "Comprehensive guide featuring sustainable gift options across various categories and price points",
      qualityScore: 88,
      cost: 6500,
      campaignScores: {
        overallEffectiveness: 85,
        strategicAlignment: 89,
        customerAlignment: 87,
        contentEffectiveness: 79
      },
      audience: "Environmentally-conscious gift-givers",
      keyActions: ["Curate products across price ranges", "Develop gift personas/categories", "Include impactful sustainability metrics"],
      agencies: ["Season Shift Creative"]
    },
    {
      id: "es-content-12",
      name: "Eco-Friendly Gift Wrapping Tutorial",
      campaign: "Holiday Gift Guide: Sustainable Edition",
      format: "Social Media",
      type: "driver",
      status: "draft",
      scores: {
        overall: 82,
        strategic: 84,
        customer: 90,
        execution: 78
      },
      description: "Visual tutorial series showing beautiful, waste-free gift wrapping techniques",
      qualityScore: 86,
      cost: 3800,
      campaignScores: {
        overallEffectiveness: 81,
        strategicAlignment: 83,
        customerAlignment: 89,
        contentEffectiveness: 77
      },
      audience: "Holiday shoppers interested in reducing waste",
      keyActions: ["Develop 5-7 unique wrapping techniques", "Create step-by-step visual guides", "Source sustainable wrapping materials"],
      agencies: ["Season Shift Creative"]
    },
    {
      id: "es-content-13",
      name: "Holiday Sustainability Email Series",
      campaign: "Holiday Gift Guide: Sustainable Edition",
      format: "Email",
      type: "driver",
      status: "draft",
      scores: {
        overall: 79,
        strategic: 85,
        customer: 80,
        execution: 72
      },
      description: "Weekly email series with sustainable holiday tips, gift ideas, and exclusive offers",
      qualityScore: 81,
      cost: 4600,
      campaignScores: {
        overallEffectiveness: 78,
        strategicAlignment: 84,
        customerAlignment: 79,
        contentEffectiveness: 71
      },
      audience: "Existing customers and email subscribers",
      keyActions: ["Develop 8-week email content calendar", "Create holiday-themed templates", "Include gift bundle recommendations"],
      agencies: ["GreenRetail Consultants"]
    },
    {
      id: "es-content-14",
      name: "Sustainable Gift Impact Calculator",
      campaign: "Holiday Gift Guide: Sustainable Edition",
      format: "Blog Post",
      type: "hero",
      status: "draft",
      scores: {
        overall: 88,
        strategic: 92,
        customer: 85,
        execution: 85
      },
      description: "Interactive tool showing the environmental impact savings of sustainable gifts versus conventional alternatives",
      qualityScore: 90,
      cost: 8500,
      campaignScores: {
        overallEffectiveness: 87,
        strategicAlignment: 91,
        customerAlignment: 84,
        contentEffectiveness: 84
      },
      audience: "Environmentally-conscious gift-givers seeking validation",
      keyActions: ["Develop calculation methodology with environmental scientists", "Create interactive web tool", "Include shareable results"],
      agencies: ["GreenRetail Consultants"]
    },
    {
      id: "es-content-15",
      name: "Sustainable Gift Recipient Personas",
      campaign: "Holiday Gift Guide: Sustainable Edition",
      format: "Social Media",
      type: "driver",
      status: "draft",
      scores: {
        overall: 83,
        strategic: 86,
        customer: 89,
        execution: 77
      },
      description: "A series of persona-based gift recommendation posts for different types of recipients",
      qualityScore: 85,
      cost: 4000,
      campaignScores: {
        overallEffectiveness: 82,
        strategicAlignment: 85,
        customerAlignment: 88,
        contentEffectiveness: 76
      },
      audience: "Holiday shoppers seeking personalized gift ideas",
      keyActions: ["Develop 8-10 distinct recipient personas", "Create curated product selections for each", "Design shareable graphics"],
      agencies: ["Season Shift Creative"]
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
  },
  personas: [
    {
      name: "Persona 1",
      description: "Career-focused individuals aged 25-35 who prioritize quality and convenience",
      icon: "User",
      scores: {
        overall: 83,
        strategic: 87,
        customer: 82,
        execution: 81
      }
    },
    {
      name: "Persona 2",
      description: "Family-oriented consumers aged 30-45 seeking reliable and valuable solutions",
      icon: "MessageSquare",
      scores: {
        overall: 80,
        strategic: 76,
        customer: 84,
        execution: 78
      }
    },
    {
      name: "Persona 3",
      description: "Early adopters aged 20-40 who embrace new technologies and experiences",
      icon: "Star",
      scores: {
        overall: 78,
        strategic: 80,
        customer: 74,
        execution: 70
      }
    }
  ],
  performanceTimeData: [
    {
      month: "Jan 2023",
      overall: 63,
      strategic: 60,
      customer: 65,
      content: 62
    },
    {
      month: "Feb 2023",
      overall: 66,
      strategic: 64,
      customer: 68,
      content: 65
    },
    {
      month: "Mar 2023",
      overall: 70,
      strategic: 69,
      customer: 71,
      content: 70
    },
    {
      month: "Apr 2023",
      overall: 72,
      strategic: 71,
      customer: 74,
      content: 71
    },
    {
      month: "May 2023",
      overall: 76,
      strategic: 75,
      customer: 78,
      content: 75
    },
    {
      month: "Jun 2023",
      overall: 79,
      strategic: 77,
      customer: 81,
      content: 78
    },
    {
      month: "Jul 2023",
      overall: 83,
      strategic: 82,
      customer: 84,
      content: 82
    },
    {
      month: "Aug 2023",
      overall: 87,
      strategic: 85,
      customer: 89,
      content: 86
    }
  ]
}; 