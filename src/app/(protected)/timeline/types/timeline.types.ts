export type TimelineItemType = "place" | "movie" | "memory";

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  date: string;
  photo?: string;
  description?: string;
  rating?: number;
  sourceId: string;
  category?: string;
}

export interface TimelineMonth {
  month: string;
  label: string;
  items: TimelineItem[];
}

export interface TimelineResponse {
  data: TimelineItem[];
}

export interface TimelineViewProps {
  title: string;
  months: TimelineMonth[];
  isLoading: boolean;
}
