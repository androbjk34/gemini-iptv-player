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
  isFavorite?: boolean;
}
