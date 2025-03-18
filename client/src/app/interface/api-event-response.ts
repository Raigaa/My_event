import { EventEntry } from './event-entry';

export interface ApiEventResponse {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    error: string | null;
    limit: number;
    data: {
      total_count: number;
      results: EventEntry[];
    };
}
