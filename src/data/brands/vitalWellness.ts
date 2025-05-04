// src/data/brands/vitalWellness.ts
// Data for the VitalWellness brand

import type { BrandData } from '../../types/brand';

export const vitalWellnessData: BrandData = {
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
      timeframe: "Feb 10 - Aug 31, 2023",
      strategicObjective: "Establish VitalWellness as a trusted authority in sleep health, driving a 35% increase in sleep-related product sales and generating 50,000 new customer profiles through sleep assessment tools.",
      audience: "Health-conscious professionals (30-55) struggling with sleep quality amid busy lifestyles, and active seniors seeking to improve overall health through better sleep.",
      keyActions: [
        "Launch sleep quality assessment tool with personalized recommendations",
        "Develop expert-led webinar series on sleep science and optimization",
        "Create content partnership with sleep research institution",
        "Implement targeted ad campaign around key sleep deprivation symptoms"
      ],
      campaignDetails: "The Sleep Revolution campaign frames quality sleep as the foundation of overall health and wellness, positioning VitalWellness products as science-backed solutions for optimizing this critical but often neglected health factor. The campaign balances educational content with clear product benefits.",
      agencies: ["Health Content Experts", "BioScience Communications", "Digital Health Promotions"],
      budget: 120000
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
      timeframe: "Sep 15 - Mar 31, 2024",
      strategicObjective: "Increase sales of immune support products by 40% during cold and flu season by educating consumers on evidence-based approaches to immune system optimization.",
      audience: "Health-conscious individuals across age groups concerned with maintaining wellness during seasonal illness peaks and seeking natural, preventative approaches.",
      keyActions: [
        "Create seasonal immune support guides with product integration",
        "Develop immune system explainer content with medical experts",
        "Implement targeted email journey based on specific health concerns",
        "Launch interactive immune health assessment with personalized product recommendations"
      ],
      campaignDetails: "Immune Health Awareness addresses growing consumer interest in preventative health measures by providing accessible, science-based education on immune function and support. The campaign emphasizes daily habits and nutritional approaches that complement VitalWellness products.",
      agencies: ["Preventative Health Partners", "Medical Communications Group"],
      budget: 110000
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
      timeframe: "Nov 01 - Feb 28, 2024",
      strategicObjective: "Capture 15% market share in the rapidly growing active seniors wellness segment by positioning VitalWellness products as essential tools for maintaining vitality and independence with age.",
      audience: "Active adults 55+ committed to maintaining physical and mental wellness as they age, with particular focus on newly retired individuals establishing health routines.",
      keyActions: [
        "Develop age-specific fitness program with graduated levels",
        "Create testimonial campaign featuring active seniors with inspiring stories",
        "Partner with retirement planning services for wellness component",
        "Launch dedicated product line with age-specific formulations and benefits"
      ],
      campaignDetails: "The Active Aging Initiative reframes the conversation around aging from limitation to opportunity, showcasing how VitalWellness products support continued activity and engagement throughout life. The campaign empowers older adults with evidence-based tools for maintaining independence and joy through wellness practices.",
      agencies: ["Seniors Marketing Specialists", "Health Testimonial Productions"],
      budget: 95000
    }
  ],
  content: [
    {
      id: "vw-content-1",
      name: "Sleep Science Webinar Series",
      campaign: "Sleep Revolution",
      format: "Social Media",
      type: "hero",
      status: "live",
      scores: {
        overall: 87,
        strategic: 85,
        customer: 92,
        execution: 84
      },
      description: "Monthly webinars featuring sleep experts discussing the science of sleep and optimization strategies",
      qualityScore: 88,
      cost: 12000,
      campaignScores: {
        overallEffectiveness: 86,
        strategicAlignment: 84,
        customerAlignment: 91,
        contentEffectiveness: 83
      },
      audience: "Health-conscious professionals and active seniors",
      keyActions: ["Recruit credible sleep experts", "Develop engaging presentation format", "Create promotional clips for social media"],
      agencies: ["Health Content Experts", "BioScience Communications"]
    },
    {
      id: "vw-content-2",
      name: "Sleep Quality Assessment Tool",
      campaign: "Sleep Revolution",
      format: "Blog Post",
      type: "driver",
      status: "live",
      scores: {
        overall: 90,
        strategic: 92,
        customer: 94,
        execution: 85
      },
      description: "Interactive assessment tool helping users identify sleep quality issues with personalized recommendations",
      qualityScore: 92,
      cost: 15000,
      campaignScores: {
        overallEffectiveness: 89,
        strategicAlignment: 91,
        customerAlignment: 93,
        contentEffectiveness: 84
      },
      audience: "Individuals experiencing sleep issues",
      keyActions: ["Develop science-based assessment questions", "Create personalized recommendation engine", "Integrate email capture system"],
      agencies: ["Health Content Experts", "Digital Health Promotions"]
    },
    {
      id: "vw-content-3",
      name: "Sleep Optimization Email Course",
      campaign: "Sleep Revolution",
      format: "Email",
      type: "driver",
      status: "live",
      scores: {
        overall: 85,
        strategic: 88,
        customer: 90,
        execution: 82
      },
      description: "Seven-day email course teaching evidence-based sleep optimization techniques with product integration",
      qualityScore: 87,
      cost: 9000,
      campaignScores: {
        overallEffectiveness: 84,
        strategicAlignment: 87,
        customerAlignment: 89,
        contentEffectiveness: 81
      },
      audience: "Health-conscious professionals with busy lifestyles",
      keyActions: ["Develop progressive sleep education content", "Create behavior change prompts", "Include sleep tracking elements"],
      agencies: ["Health Content Experts"]
    },
    {
      id: "vw-content-4",
      name: "Sleep Environment Optimization Guide",
      campaign: "Sleep Revolution",
      format: "Blog Post",
      type: "hero",
      status: "live",
      scores: {
        overall: 83,
        strategic: 80,
        customer: 87,
        execution: 78
      },
      description: "Comprehensive guide to creating the optimal sleep environment with VitalWellness products",
      qualityScore: 85,
      cost: 7500,
      campaignScores: {
        overallEffectiveness: 82,
        strategicAlignment: 79,
        customerAlignment: 86,
        contentEffectiveness: 77
      },
      audience: "Home wellness enthusiasts",
      keyActions: ["Research environmental sleep factors", "Create bedroom optimization checklist", "Include natural product recommendations"],
      agencies: ["BioScience Communications"]
    },
    {
      id: "vw-content-5",
      name: "Sleep Tracking Monthly Newsletter",
      campaign: "Sleep Revolution",
      format: "Email",
      type: "driver",
      status: "draft",
      scores: {
        overall: 81,
        strategic: 84,
        customer: 83,
        execution: 76
      },
      description: "Monthly newsletter featuring sleep research updates, product recommendations, and tracking tips",
      qualityScore: 82,
      cost: 6000,
      campaignScores: {
        overallEffectiveness: 80,
        strategicAlignment: 83,
        customerAlignment: 82,
        contentEffectiveness: 75
      },
      audience: "Existing customers using sleep products",
      keyActions: ["Curate latest sleep research findings", "Feature customer sleep success stories", "Include seasonal sleep tips"],
      agencies: ["Digital Health Promotions"]
    },
    {
      id: "vw-content-6",
      name: "Seasonal Immune Support Guide",
      campaign: "Immune Health Awareness",
      format: "Blog Post",
      type: "hero",
      status: "live",
      scores: {
        overall: 86,
        strategic: 83,
        customer: 90,
        execution: 82
      },
      description: "Seasonal guide to supporting immune function through nutrition, supplements, and lifestyle practices",
      qualityScore: 87,
      cost: 8500,
      campaignScores: {
        overallEffectiveness: 85,
        strategicAlignment: 82,
        customerAlignment: 89,
        contentEffectiveness: 81
      },
      audience: "Health-conscious individuals across demographics",
      keyActions: ["Research season-specific immune challenges", "Develop evidence-based recommendations", "Feature product integration points"],
      agencies: ["Preventative Health Partners"]
    },
    {
      id: "vw-content-7",
      name: "Immune System Explainer Series",
      campaign: "Immune Health Awareness",
      format: "Social Media",
      type: "driver",
      status: "live",
      scores: {
        overall: 82,
        strategic: 78,
        customer: 88,
        execution: 80
      },
      description: "Educational social media series explaining immune system components and functions in accessible language",
      qualityScore: 84,
      cost: 7000,
      campaignScores: {
        overallEffectiveness: 81,
        strategicAlignment: 77,
        customerAlignment: 87,
        contentEffectiveness: 79
      },
      audience: "General public interested in health education",
      keyActions: ["Create engaging immune system graphics", "Develop simplified explanations", "Include 'did you know' facts"],
      agencies: ["Medical Communications Group"]
    },
    {
      id: "vw-content-8",
      name: "Immune Health Assessment Tool",
      campaign: "Immune Health Awareness",
      format: "Blog Post",
      type: "driver",
      status: "draft",
      scores: {
        overall: 89,
        strategic: 86,
        customer: 93,
        execution: 84
      },
      description: "Interactive assessment helping users identify potential immune health issues with tailored recommendations",
      qualityScore: 90,
      cost: 12000,
      campaignScores: {
        overallEffectiveness: 88,
        strategicAlignment: 85,
        customerAlignment: 92,
        contentEffectiveness: 83
      },
      audience: "Health-conscious individuals seeking personalized guidance",
      keyActions: ["Develop science-based assessment logic", "Create recommendation algorithm", "Include product suggestions based on results"],
      agencies: ["Preventative Health Partners", "Digital Health Promotions"]
    },
    {
      id: "vw-content-9",
      name: "Immune Support Recipe Collection",
      campaign: "Immune Health Awareness",
      format: "Email",
      type: "hero",
      status: "live",
      scores: {
        overall: 85,
        strategic: 80,
        customer: 91,
        execution: 82
      },
      description: "Collection of immune-supporting recipes featuring ingredients that complement VitalWellness supplements",
      qualityScore: 87,
      cost: 8000,
      campaignScores: {
        overallEffectiveness: 84,
        strategicAlignment: 79,
        customerAlignment: 90,
        contentEffectiveness: 81
      },
      audience: "Health-focused home cooks",
      keyActions: ["Develop nutrient-rich recipes with immune benefits", "Create beautiful food photography", "Include nutritional information"],
      agencies: ["Preventative Health Partners"]
    },
    {
      id: "vw-content-10",
      name: "Immune Health Expert Q&A Series",
      campaign: "Immune Health Awareness",
      format: "Social Media",
      type: "driver",
      status: "draft",
      scores: {
        overall: 80,
        strategic: 76,
        customer: 85,
        execution: 78
      },
      description: "Monthly live Q&A sessions with immunologists and nutrition experts answering audience questions",
      qualityScore: 82,
      cost: 9500,
      campaignScores: {
        overallEffectiveness: 79,
        strategicAlignment: 75,
        customerAlignment: 84,
        contentEffectiveness: 77
      },
      audience: "Health-conscious individuals seeking expert guidance",
      keyActions: ["Recruit credible health experts", "Collect audience questions in advance", "Create highlight clips for ongoing use"],
      agencies: ["Medical Communications Group"]
    },
    {
      id: "vw-content-11",
      name: "Active Aging Exercise Program",
      campaign: "Active Aging Initiative",
      format: "Blog Post",
      type: "hero",
      status: "draft",
      scores: {
        overall: 88,
        strategic: 92,
        customer: 90,
        execution: 82
      },
      description: "Age-appropriate exercise program with progressive levels designed specifically for seniors",
      qualityScore: 90,
      cost: 11000,
      campaignScores: {
        overallEffectiveness: 87,
        strategicAlignment: 91,
        customerAlignment: 89,
        contentEffectiveness: 81
      },
      audience: "Active adults 55+ committed to physical fitness",
      keyActions: ["Develop exercises with geriatric fitness experts", "Create clear, safe instructions", "Include modifications for different abilities"],
      agencies: ["Seniors Marketing Specialists"]
    },
    {
      id: "vw-content-12",
      name: "Aging Well Success Stories",
      campaign: "Active Aging Initiative",
      format: "Social Media",
      type: "driver",
      status: "draft",
      scores: {
        overall: 85,
        strategic: 88,
        customer: 94,
        execution: 78
      },
      description: "Inspirational stories of seniors thriving with the help of VitalWellness products and programs",
      qualityScore: 89,
      cost: 9500,
      campaignScores: {
        overallEffectiveness: 84,
        strategicAlignment: 87,
        customerAlignment: 93,
        contentEffectiveness: 77
      },
      audience: "Adults 55+ and their adult children",
      keyActions: ["Identify diverse, inspiring seniors", "Capture authentic stories and imagery", "Show active lifestyle activities"],
      agencies: ["Health Testimonial Productions"]
    },
    {
      id: "vw-content-13",
      name: "Senior Wellness Assessment Tool",
      campaign: "Active Aging Initiative",
      format: "Blog Post",
      type: "driver",
      status: "draft",
      scores: {
        overall: 82,
        strategic: 85,
        customer: 88,
        execution: 75
      },
      description: "Interactive assessment helping seniors identify health optimization opportunities with personalized recommendations",
      qualityScore: 84,
      cost: 10000,
      campaignScores: {
        overallEffectiveness: 81,
        strategicAlignment: 84,
        customerAlignment: 87,
        contentEffectiveness: 74
      },
      audience: "Adults 55+ interested in proactive health management",
      keyActions: ["Develop age-appropriate assessment criteria", "Create senior-friendly interface", "Include printable results option"],
      agencies: ["Seniors Marketing Specialists", "Digital Health Promotions"]
    },
    {
      id: "vw-content-14",
      name: "Vitality After 50 Newsletter",
      campaign: "Active Aging Initiative",
      format: "Email",
      type: "hero",
      status: "draft",
      scores: {
        overall: 79,
        strategic: 86,
        customer: 83,
        execution: 72
      },
      description: "Monthly newsletter focused on active aging topics, wellness tips, and product recommendations",
      qualityScore: 81,
      cost: 6500,
      campaignScores: {
        overallEffectiveness: 78,
        strategicAlignment: 85,
        customerAlignment: 82,
        contentEffectiveness: 71
      },
      audience: "Adults 55+ committed to active aging",
      keyActions: ["Develop senior-friendly design templates", "Create age-appropriate wellness content", "Include success stories and testimonials"],
      agencies: ["Seniors Marketing Specialists"]
    },
    {
      id: "vw-content-15",
      name: "Retirement Wellness Planning Guide",
      campaign: "Active Aging Initiative",
      format: "Email",
      type: "driver",
      status: "draft",
      scores: {
        overall: 84,
        strategic: 90,
        customer: 86,
        execution: 76
      },
      description: "Email series guiding newly retired adults in establishing health routines and wellness practices",
      qualityScore: 86,
      cost: 7500,
      campaignScores: {
        overallEffectiveness: 83,
        strategicAlignment: 89,
        customerAlignment: 85,
        contentEffectiveness: 75
      },
      audience: "Newly retired adults establishing new routines",
      keyActions: ["Research retirement transition health needs", "Create structured wellness planning framework", "Include product integration points"],
      agencies: ["Seniors Marketing Specialists"]
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
        opportunities: ["Interactive demos", "Use case scenarios", "Expert endorsements"]
      },
      {
        stage: "Purchase",
        touchpoints: ["E-commerce", "Health retailers", "Subscription programs"],
        opportunities: ["Personalized recommendations", "Starter kits", "Risk-free trials"]
      }
    ]
  }
}; 