export interface ContentItem {
  id: string;
  name: string;
  format: string;
  type: string;
  campaign?: string;
  campaignId?: string;
  status: 'live' | 'draft' | 'planned';
  qualityScore?: number;
  description?: string;
  cost?: number;
  strategicObjective?: string;
  campaignObjectives?: string[];
  customerValueProp?: string;
  audience?: string;
  keyActions?: string[];
  campaignDetails?: string;
  agencies?: string[];
  campaignScores?: {
    overallEffectiveness: number;
    strategicAlignment: number;
    customerAlignment: number;
    contentEffectiveness: number;
  };
  objective?: string;
  kpis?: string[];
  agency?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface CanvasNode {
  id: string;
  content: ContentItem;
  position: Position;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export interface JourneyMap {
  nodes: CanvasNode[];
  connections: Connection[];
  title: string;
} 