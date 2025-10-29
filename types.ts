
export interface Program {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface Category {
  id: string;
  name:string;
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category: string; // Category ID
  epg: Program[];
  isFavorite?: boolean;
}