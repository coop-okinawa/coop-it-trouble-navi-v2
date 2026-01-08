
export type NodeType = "question" | "action" | "end";

export interface Source {
  title: string;
  url: string;
}

export interface TicketPreset {
  category: string;
  urgency: '高' | '中' | '低';
  notes: string;
  requiredFields?: string[];
}

export interface FlowNode {
  type: NodeType;
  title: string;
  body: string;
  steps?: string[];
  sources?: Source[];
  yes?: string;
  no?: string;
  resolvedYes?: string;
  resolvedNo?: string;
  ticketPreset?: TicketPreset;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  startNodeId: string;
  icon?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  url?: string;
  tags?: string[];
  isPublished: boolean;
}

export interface AppState {
  categories: Category[];
  nodes: Record<string, FlowNode>;
  news: NewsItem[];
  lastSavedAt: string;
  version: string;
}

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  message: string;
  location: 'category' | 'node' | 'news';
}

export interface FlowData {
  categories: Category[];
  nodes: Record<string, FlowNode>;
}
