// src/data/brands/techNova.ts
// Data for the TechNova brand

import type { BrandData } from '../../types/brand';

export const techNovaData: BrandData = {
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
      timeframe: "May 01 - Jul 15, 2023",
      strategicObjective: "Successfully launch our flagship AI-powered product line with 50,000 units sold in the first quarter and establish TechNova as an innovation leader in consumer AI technology.",
      audience: "Early technology adopters, professionals 28-45, with high disposable income and interest in cutting-edge AI and smart home technology.",
      keyActions: [
        "Orchestrate major product keynote event with live streaming across platforms",
        "Secure reviews with top 20 tech influencers and publications",
        "Launch immersive digital experience showcasing AI capabilities",
        "Implement phased retail rollout with premium in-store experiences"
      ],
      campaignDetails: "The Next Gen Product Launch introduces our revolutionary AI Assistant platform through a carefully choreographed multi-channel campaign. Using a 'seeing is believing' approach, we demonstrate how our technology transforms daily interactions with technology through personalization and predictive capabilities.",
      agencies: ["FutureTech Marketing", "Immersive Experience Labs", "Media Matters PR"],
      budget: 250000
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
      timeframe: "Jan 20 - Dec 31, 2023",
      strategicObjective: "Position TechNova's productivity ecosystem as essential tools for the modern remote and hybrid workforce, increasing B2B and professional subscription revenue by 30%.",
      audience: "Remote and hybrid professionals, digital nomads, and small business owners seeking technology solutions that enhance productivity and flexibility.",
      keyActions: [
        "Develop case studies of productivity gains with diverse professionals",
        "Create 'Work From Anywhere' certification program for businesses",
        "Launch productivity tips content series across platforms",
        "Offer bundled 'anywhere office' product packages"
      ],
      campaignDetails: "The Work From Anywhere campaign addresses the permanent shift to flexible work arrangements by showcasing how TechNova's integrated ecosystem creates a seamless productivity experience across locations and devices. This year-long initiative evolves with seasonal 'workstyle' themes.",
      agencies: ["Workplace Future Collective", "B2B Growth Partners"],
      budget: 180000
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
      timeframe: "Sep 01 - Nov 30, 2023",
      strategicObjective: "Drive adoption of TechNova's connected home ecosystem, increasing multiple-device households by 40% and boosting recurring subscription revenue.",
      audience: "Tech-interested homeowners and apartment dwellers looking to enhance their living spaces with connected technology that prioritizes both convenience and privacy.",
      keyActions: [
        "Create interactive home setup advisor tool for personalized recommendations",
        "Develop video series showcasing real-world smart home transformations",
        "Partner with home renovation and interior design influencers",
        "Launch 'get started' bundles with simplified setup and integration"
      ],
      campaignDetails: "Smart Home Essentials demystifies the connected home, using approachable language and real-life examples to illustrate how TechNova's devices work together to create a responsive, intuitive living environment. Special emphasis on easy setup and compatibility addresses key customer pain points.",
      agencies: ["Home Technology Partners", "Visual Story Collective"],
      budget: 135000
    }
  ],
  content: [
    {
      id: "tn-content-1",
      name: "AI Assistant Product Keynote",
      campaign: "Next Gen Product Launch",
      format: "Social Media",
      type: "hero",
      status: "live",
      scores: {
        overall: 95,
        strategic: 98,
        customer: 92,
        execution: 94
      },
      description: "Live-streamed product keynote presentation introducing the new AI Assistant technology",
      qualityScore: 96,
      cost: 35000,
      campaignScores: {
        overallEffectiveness: 94,
        strategicAlignment: 97,
        customerAlignment: 91,
        contentEffectiveness: 93
      },
      audience: "Tech enthusiasts, early adopters, and industry analysts",
      keyActions: ["Produce high-quality video keynote", "Coordinate live social media streaming", "Create highlight clips for post-event promotion"],
      agencies: ["FutureTech Marketing", "Media Matters PR"]
    },
    {
      id: "tn-content-2",
      name: "AI Assistant Features Email Series",
      campaign: "Next Gen Product Launch",
      format: "Email",
      type: "driver",
      status: "live",
      scores: {
        overall: 88,
        strategic: 90,
        customer: 92,
        execution: 85
      },
      description: "Five-part email series introducing key features and use cases of the new AI Assistant",
      qualityScore: 89,
      cost: 12000,
      campaignScores: {
        overallEffectiveness: 87,
        strategicAlignment: 89,
        customerAlignment: 91,
        contentEffectiveness: 84
      },
      audience: "Existing customers and technology newsletter subscribers",
      keyActions: ["Create feature-focused email templates", "Develop progressive feature revelation", "Include pre-order incentives"],
      agencies: ["FutureTech Marketing"]
    },
    {
      id: "tn-content-3",
      name: "AI Assistant Tech Deep Dive",
      campaign: "Next Gen Product Launch",
      format: "Blog Post",
      type: "driver",
      status: "live",
      scores: {
        overall: 92,
        strategic: 88,
        customer: 85,
        execution: 90
      },
      description: "Technical blog post explaining the AI technology behind the new product line",
      qualityScore: 90,
      cost: 8500,
      campaignScores: {
        overallEffectiveness: 91,
        strategicAlignment: 87,
        customerAlignment: 84,
        contentEffectiveness: 89
      },
      audience: "Technical professionals and AI enthusiasts",
      keyActions: ["Interview R&D team", "Develop technical diagrams", "Balance technical depth with accessibility"],
      agencies: ["FutureTech Marketing"]
    },
    {
      id: "tn-content-4",
      name: "AI Assistant User Testimonials",
      campaign: "Next Gen Product Launch",
      format: "Social Media",
      type: "driver",
      status: "live",
      scores: {
        overall: 89,
        strategic: 86,
        customer: 94,
        execution: 87
      },
      description: "Series of beta user testimonial videos showcasing real-world applications of the new technology",
      qualityScore: 90,
      cost: 15000,
      campaignScores: {
        overallEffectiveness: 88,
        strategicAlignment: 85,
        customerAlignment: 93,
        contentEffectiveness: 86
      },
      audience: "Potential customers seeking validation from peers",
      keyActions: ["Select diverse beta users", "Film in authentic environments", "Focus on transformative use cases"],
      agencies: ["Immersive Experience Labs"]
    },
    {
      id: "tn-content-5",
      name: "Pre-Order Campaign Email Sequence",
      campaign: "Next Gen Product Launch",
      format: "Email",
      type: "hero",
      status: "live",
      scores: {
        overall: 91,
        strategic: 94,
        customer: 88,
        execution: 89
      },
      description: "Targeted email sequence driving pre-orders with exclusive incentives and early-access benefits",
      qualityScore: 92,
      cost: 18000,
      campaignScores: {
        overallEffectiveness: 90,
        strategicAlignment: 93,
        customerAlignment: 87,
        contentEffectiveness: 88
      },
      audience: "Previous customers and high-intent prospects",
      keyActions: ["Create urgency-based messaging", "Develop tiered pre-order incentives", "Include countdown elements"],
      agencies: ["FutureTech Marketing", "Media Matters PR"]
    },
    {
      id: "tn-content-6",
      name: "Remote Work Productivity Guide",
      campaign: "Work From Anywhere",
      format: "Blog Post",
      type: "hero",
      status: "live",
      scores: {
        overall: 87,
        strategic: 90,
        customer: 92,
        execution: 83
      },
      description: "Comprehensive guide to maximizing productivity with TechNova products in remote work settings",
      qualityScore: 89,
      cost: 9500,
      campaignScores: {
        overallEffectiveness: 86,
        strategicAlignment: 89,
        customerAlignment: 91,
        contentEffectiveness: 82
      },
      audience: "Remote professionals and digital nomads",
      keyActions: ["Research remote work pain points", "Create tailored product solutions", "Include productivity methodology"],
      agencies: ["Workplace Future Collective"]
    },
    {
      id: "tn-content-7",
      name: "Work From Anywhere Setup Tutorials",
      campaign: "Work From Anywhere",
      format: "Social Media",
      type: "driver",
      status: "live",
      scores: {
        overall: 85,
        strategic: 82,
        customer: 90,
        execution: 83
      },
      description: "Video tutorial series showing optimal workspace setup in various locations (home, coffee shop, co-working space, etc.)",
      qualityScore: 86,
      cost: 11000,
      campaignScores: {
        overallEffectiveness: 84,
        strategicAlignment: 81,
        customerAlignment: 89,
        contentEffectiveness: 82
      },
      audience: "Remote workers in various environments",
      keyActions: ["Film in diverse work settings", "Feature real remote workers", "Highlight location-specific solutions"],
      agencies: ["Workplace Future Collective"]
    },
    {
      id: "tn-content-8",
      name: "Remote Team Collaboration Success Stories",
      campaign: "Work From Anywhere",
      format: "Blog Post",
      type: "driver",
      status: "live",
      scores: {
        overall: 83,
        strategic: 87,
        customer: 85,
        execution: 79
      },
      description: "Case studies of businesses successfully implementing TechNova solutions for distributed team collaboration",
      qualityScore: 85,
      cost: 8000,
      campaignScores: {
        overallEffectiveness: 82,
        strategicAlignment: 86,
        customerAlignment: 84,
        contentEffectiveness: 78
      },
      audience: "Business leaders and team managers",
      keyActions: ["Identify diverse business cases", "Capture measurable outcomes", "Include implementation roadmaps"],
      agencies: ["B2B Growth Partners"]
    },
    {
      id: "tn-content-9",
      name: "Digital Nomad Technology Kit",
      campaign: "Work From Anywhere",
      format: "Email",
      type: "hero",
      status: "draft",
      scores: {
        overall: 89,
        strategic: 85,
        customer: 93,
        execution: 80
      },
      description: "Email campaign promoting curated technology bundles for digital nomads and location-independent professionals",
      qualityScore: 90,
      cost: 7500,
      campaignScores: {
        overallEffectiveness: 88,
        strategicAlignment: 84,
        customerAlignment: 92,
        contentEffectiveness: 79
      },
      audience: "Digital nomads and frequent travelers",
      keyActions: ["Create location-themed kit bundles", "Emphasize portability and connectivity", "Include real user scenarios"],
      agencies: ["Workplace Future Collective"]
    },
    {
      id: "tn-content-10",
      name: "Productivity App Integration Guides",
      campaign: "Work From Anywhere",
      format: "Blog Post",
      type: "driver",
      status: "draft",
      scores: {
        overall: 81,
        strategic: 84,
        customer: 79,
        execution: 76
      },
      description: "Step-by-step guides for integrating TechNova products with popular productivity and collaboration apps",
      qualityScore: 82,
      cost: 6000,
      campaignScores: {
        overallEffectiveness: 80,
        strategicAlignment: 83,
        customerAlignment: 78,
        contentEffectiveness: 75
      },
      audience: "Technical professionals seeking seamless workflows",
      keyActions: ["Research most-used productivity apps", "Create integration walkthroughs", "Highlight efficiency gains"],
      agencies: ["B2B Growth Partners"]
    },
    {
      id: "tn-content-11",
      name: "Smart Home Setup Guide",
      campaign: "Smart Home Essentials",
      format: "Blog Post",
      type: "hero",
      status: "draft",
      scores: {
        overall: 84,
        strategic: 86,
        customer: 88,
        execution: 78
      },
      description: "Comprehensive guide to setting up a TechNova-powered smart home ecosystem from start to finish",
      qualityScore: 86,
      cost: 9000,
      campaignScores: {
        overallEffectiveness: 83,
        strategicAlignment: 85,
        customerAlignment: 87,
        contentEffectiveness: 77
      },
      audience: "First-time smart home adopters",
      keyActions: ["Create room-by-room setup guides", "Include troubleshooting FAQ", "Develop product compatibility matrix"],
      agencies: ["Home Technology Partners"]
    },
    {
      id: "tn-content-12",
      name: "Smart Home Transformation Stories",
      campaign: "Smart Home Essentials",
      format: "Social Media",
      type: "driver",
      status: "draft",
      scores: {
        overall: 80,
        strategic: 82,
        customer: 86,
        execution: 75
      },
      description: "Before-and-after video series featuring real homes transformed with TechNova smart technology",
      qualityScore: 83,
      cost: 12500,
      campaignScores: {
        overallEffectiveness: 79,
        strategicAlignment: 81,
        customerAlignment: 85,
        contentEffectiveness: 74
      },
      audience: "Homeowners considering smart home upgrades",
      keyActions: ["Feature diverse home types and families", "Capture authentic reactions", "Highlight transformative moments"],
      agencies: ["Visual Story Collective"]
    },
    {
      id: "tn-content-13",
      name: "Smart Home Device Recommendation Quiz",
      campaign: "Smart Home Essentials",
      format: "Email",
      type: "driver",
      status: "draft",
      scores: {
        overall: 85,
        strategic: 89,
        customer: 91,
        execution: 76
      },
      description: "Interactive email campaign with a quiz leading to personalized smart home device recommendations",
      qualityScore: 87,
      cost: 8500,
      campaignScores: {
        overallEffectiveness: 84,
        strategicAlignment: 88,
        customerAlignment: 90,
        contentEffectiveness: 75
      },
      audience: "Potential customers in research phase",
      keyActions: ["Develop lifestyle-based question flow", "Create personalized recommendation logic", "Include special offers based on results"],
      agencies: ["Home Technology Partners"]
    },
    {
      id: "tn-content-14",
      name: "Smart Home Energy Savings Calculator",
      campaign: "Smart Home Essentials",
      format: "Blog Post",
      type: "driver",
      status: "draft",
      scores: {
        overall: 79,
        strategic: 83,
        customer: 84,
        execution: 72
      },
      description: "Interactive tool calculating potential energy and cost savings from implementing TechNova smart home devices",
      qualityScore: 81,
      cost: 7800,
      campaignScores: {
        overallEffectiveness: 78,
        strategicAlignment: 82,
        customerAlignment: 83,
        contentEffectiveness: 71
      },
      audience: "Cost-conscious homeowners",
      keyActions: ["Develop accurate calculation methodology", "Create user-friendly interface", "Include rebate information"],
      agencies: ["Home Technology Partners"]
    },
    {
      id: "tn-content-15",
      name: "Smart Home Seasonal Settings Guide",
      campaign: "Smart Home Essentials",
      format: "Email",
      type: "hero",
      status: "draft",
      scores: {
        overall: 82,
        strategic: 80,
        customer: 88,
        execution: 78
      },
      description: "Email series with optimization guides for smart home settings across different seasons",
      qualityScore: 84,
      cost: 6500,
      campaignScores: {
        overallEffectiveness: 81,
        strategicAlignment: 79,
        customerAlignment: 87,
        contentEffectiveness: 77
      },
      audience: "Existing smart home device owners",
      keyActions: ["Create season-specific optimization tips", "Include automation recipe suggestions", "Feature relevant accessories"],
      agencies: ["Home Technology Partners"]
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
  },
  personas: [
    {
      name: "Persona 1",
      description: "Career-focused individuals aged 25-35 who prioritize quality and convenience",
      icon: "User",
      scores: {
        overall: 86,
        strategic: 90,
        customer: 84,
        execution: 84
      }
    },
    {
      name: "Persona 2",
      description: "Family-oriented consumers aged 30-45 seeking reliable and valuable solutions",
      icon: "MessageSquare",
      scores: {
        overall: 82,
        strategic: 78,
        customer: 88,
        execution: 80
      }
    },
    {
      name: "Persona 3",
      description: "Early adopters aged 20-40 who embrace new technologies and experiences",
      icon: "Star",
      scores: {
        overall: 74,
        strategic: 82,
        customer: 76,
        execution: 65
      }
    }
  ],
  performanceTimeData: [
    {
      month: "Jan 2023",
      overall: 65,
      strategic: 62,
      customer: 68,
      content: 64
    },
    {
      month: "Feb 2023",
      overall: 68,
      strategic: 65,
      customer: 70,
      content: 68
    },
    {
      month: "Mar 2023",
      overall: 72,
      strategic: 70,
      customer: 73,
      content: 72
    },
    {
      month: "Apr 2023",
      overall: 74,
      strategic: 73,
      customer: 76,
      content: 73
    },
    {
      month: "May 2023",
      overall: 78,
      strategic: 76,
      customer: 79,
      content: 77
    },
    {
      month: "Jun 2023",
      overall: 75,
      strategic: 74,
      customer: 77,
      content: 74
    },
    {
      month: "Jul 2023",
      overall: 82,
      strategic: 80,
      customer: 83,
      content: 81
    },
    {
      month: "Aug 2023",
      overall: 85,
      strategic: 84,
      customer: 86,
      content: 85
    }
  ]
}; 