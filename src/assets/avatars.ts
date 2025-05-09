// Demo data for use across components
export const demoData = {
  // Individual content pieces
  contentItems: [
    { 
      id: 101, 
      title: "Top 10 Product Benefits", 
      format_type: "Blog Post",
      audience_type: "Prospects",
      campaign_id: 2, // Associated with New Product Launch campaign
      quality_score: 92,
      centricity_score: 88,
      engagement_score: 85,
      overall_score: 89,
      created_at: "2024-02-18",
      views: 12500,
      conversions: 315,
      metadata: {
        imageUrl: "https://placehold.co/600x400/png",
        duration: "5 min read",
        channels: ["Website", "Social Media"]
      }
    },
    { 
      id: 102, 
      title: "Product Launch Announcement Email", 
      format_type: "Email",
      audience_type: "Subscribers",
      campaign_id: 2, // Associated with New Product Launch campaign
      quality_score: 87,
      centricity_score: 90,
      engagement_score: 76,
      overall_score: 84,
      created_at: "2024-02-15",
      views: 8750,
      conversions: 210,
      metadata: {
        imageUrl: "https://placehold.co/600x400/png",
        duration: "2 min read",
        channels: ["Email"]
      }
    },
    { 
      id: 103, 
      title: "Spring Special Offer", 
      format_type: "Email",
      audience_type: "Customers",
      campaign_id: 1, // Associated with Spring Sale campaign
      quality_score: 84,
      centricity_score: 86,
      engagement_score: 92,
      overall_score: 87,
      created_at: "2024-03-05",
      views: 9200,
      conversions: 185,
      metadata: {
        imageUrl: "https://placehold.co/600x400/png",
        duration: "3 min read",
        channels: ["Email", "Website"]
      }
    },
    { 
      id: 104, 
      title: "Spring Sale Social Media Graphics", 
      format_type: "Social Media",
      audience_type: "Broad Audience",
      campaign_id: 1, // Associated with Spring Sale campaign
      quality_score: 95,
      centricity_score: 82,
      engagement_score: 90,
      overall_score: 89,
      created_at: "2024-03-08",
      views: 22000,
      conversions: 65,
      metadata: {
        imageUrl: "https://placehold.co/600x400/png",
        duration: "N/A",
        channels: ["Instagram", "Facebook", "Twitter"]
      }
    },
    { 
      id: 105, 
      title: "Product Features Walkthrough", 
      format_type: "Video",
      audience_type: "Prospects",
      campaign_id: 2, // Associated with New Product Launch campaign
      quality_score: 96,
      centricity_score: 91,
      engagement_score: 88,
      overall_score: 92,
      created_at: "2024-02-22",
      views: 15800,
      conversions: 275,
      metadata: {
        imageUrl: "https://placehold.co/600x400/png",
        duration: "4:32 min",
        channels: ["YouTube", "Website"]
      }
    },
    { 
      id: 106, 
      title: "Quick Social Media Tips", 
      format_type: "Social Media",
      audience_type: "Customers",
      campaign_id: 1, // Associated with Spring Sale campaign
      quality_score: 42,
      centricity_score: 38,
      engagement_score: 45,
      overall_score: 42,
      created_at: "2024-03-12",
      views: 3500,
      conversions: 12,
      metadata: {
        imageUrl: "https://placehold.co/600x400/png",
        duration: "N/A",
        channels: ["Twitter"]
      }
    },
    { 
      id: 107, 
      title: "Holiday Planning Guide", 
      format_type: "Whitepaper",
      audience_type: "Prospects",
      campaign_id: 4, // Associated with Holiday Campaign
      quality_score: 85,
      centricity_score: 78,
      engagement_score: 65,
      overall_score: 76,
      created_at: "2023-11-20",
      views: 8900,
      conversions: 320,
      metadata: {
        imageUrl: "https://placehold.co/600x400/png",
        duration: "15 min read",
        channels: ["Website", "Email"]
      }
    }
  ],

  // Campaign performance data (now linked to content pieces)
  campaigns: [
    { 
      id: 1, 
      name: "Spring Sale 2024", 
      status: "Active", 
      budget: 15000, 
      spent: 7500, 
      conversions: 250, 
      roi: 180,
      content_count: 3,
      avg_content_score: 73,
      top_performing_content: 104,
      start_date: "2024-03-01",
      end_date: "2024-03-31",
      description: "Seasonal promotion targeting existing customers with special offers and discounts."
    },
    { 
      id: 2, 
      name: "New Product Launch", 
      status: "Completed", 
      budget: 25000, 
      spent: 25000, 
      conversions: 800, 
      roi: 320,
      content_count: 3,
      avg_content_score: 88,
      top_performing_content: 105,
      start_date: "2024-02-15",
      end_date: "2024-02-28",
      description: "Multi-channel campaign introducing our new premium product line to the market."
    },
    { 
      id: 3, 
      name: "Summer Awareness", 
      status: "Planned", 
      budget: 12000, 
      spent: 0, 
      conversions: 0, 
      roi: 0,
      content_count: 0,
      avg_content_score: 0,
      top_performing_content: null,
      start_date: "2024-06-01",
      end_date: "2024-06-30",
      description: "Upcoming awareness campaign targeting new market segments for summer products."
    },
    { 
      id: 4, 
      name: "Holiday Campaign", 
      status: "Active", 
      budget: 30000, 
      spent: 10000, 
      conversions: 450, 
      roi: 225,
      content_count: 5,
      avg_content_score: 76,
      top_performing_content: 107,
      start_date: "2023-11-15",
      end_date: "2023-12-20",
      description: "Holiday-focused campaign with multiple content pieces targeting gift-shoppers."
    }
  ],
  
  // Campaign analytics by channel
  campaignAnalytics: {
    byChannel: [
      { channel: "Email", engagement: 78, conversion: 3.2, reach: 25000 },
      { channel: "Social Media", engagement: 85, conversion: 1.8, reach: 120000 },
      { channel: "Website", engagement: 65, conversion: 4.5, reach: 35000 },
      { channel: "Paid Search", engagement: 45, conversion: 6.2, reach: 18000 },
      { channel: "Video", engagement: 92, conversion: 2.5, reach: 42000 }
    ],
    byContentType: [
      { type: "Blog Post", effectiveness: 82, engagement: 75, viewTime: 3.5 },
      { type: "Email", effectiveness: 76, engagement: 68, viewTime: 1.8 },
      { type: "Social Media", effectiveness: 89, engagement: 94, viewTime: 0.8 },
      { type: "Video", effectiveness: 92, engagement: 86, viewTime: 4.2 },
      { type: "Whitepaper", effectiveness: 78, engagement: 65, viewTime: 8.5 }
    ]
  },
  
  // Content performance by country
  contentPerformance: {
    byCountry: [
      { country: "United States", quality: 92, centricity: 88, engagement: 85 },
      { country: "United Kingdom", quality: 87, centricity: 85, engagement: 78 },
      { country: "Germany", quality: 85, centricity: 80, engagement: 72 },
      { country: "Canada", quality: 90, centricity: 79, engagement: 82 },
      { country: "Australia", quality: 82, centricity: 76, engagement: 80 },
      { country: "France", quality: 78, centricity: 73, engagement: 75 }
    ],
    byBrand: [
      { brand: "Main Brand", quality: 92, centricity: 88, engagement: 85 },
      { brand: "Sub-brand 1", quality: 87, centricity: 85, engagement: 78 },
      { brand: "Sub-brand 2", quality: 78, centricity: 75, engagement: 72 },
      { brand: "Partnership", quality: 83, centricity: 81, engagement: 79 }
    ],
    marketingStrategies: [
      { strategy: "Content Marketing", effectiveness: 85, brandLift: 3.2, shareable: 78 },
      { strategy: "Social Media", effectiveness: 92, brandLift: 4.1, shareable: 94 },
      { strategy: "Email Campaigns", effectiveness: 75, brandLift: 2.8, shareable: 65 },
      { strategy: "Webinars", effectiveness: 82, brandLift: 3.5, shareable: 72 },
      { strategy: "White Papers", effectiveness: 78, brandLift: 2.9, shareable: 56 }
    ]
  },
  
  // Key Performance Indicators
  kpis: [
    { id: 1, title: "Content Quality", value: 89, change: 5, unit: "%", format: "percent" },
    { id: 2, title: "Audience Engagement", value: 23500, change: 12, unit: "", format: "number" },
    { id: 3, title: "Average Time on Page", value: 3.8, change: -2, unit: "min", format: "decimal" },
    { id: 4, title: "Conversion Rate", value: 5.2, change: 0.8, unit: "%", format: "percent" }
  ],
  
  // Audience data
  audienceData: {
    audienceEngagement: [
      { persona: "Decision Makers", quality: 87, centricity: 85, engagement: 78 },
      { persona: "Influencers", quality: 92, centricity: 88, engagement: 95 },
      { persona: "End Users", quality: 78, centricity: 91, engagement: 85 },
      { persona: "Technical Staff", quality: 85, centricity: 75, engagement: 68 }
    ],
    audienceGrowth: [
      { month: "Jan", growth: 250 },
      { month: "Feb", growth: 320 },
      { month: "Mar", growth: 280 },
      { month: "Apr", growth: 450 },
      { month: "May", growth: 550 },
      { month: "Jun", growth: 420 }
    ]
  },
  
  // Performance data over time for line chart
  performanceData: [
    { month: "Jan", social: 65, email: 45, ads: 55 },
    { month: "Feb", social: 68, email: 52, ads: 57 },
    { month: "Mar", social: 70, email: 55, ads: 60 },
    { month: "Apr", social: 75, email: 57, ads: 65 },
    { month: "May", social: 82, email: 60, ads: 68 },
    { month: "Jun", social: 85, email: 63, ads: 72 },
    { month: "Jul", social: 88, email: 68, ads: 75 }
  ]
};

  export const avatars = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://placehold.co/600x400/png",
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://placehold.co/600x400/png",
    role: "Editor",
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "https://placehold.co/600x400/png",
    role: "Viewer",
  }
];