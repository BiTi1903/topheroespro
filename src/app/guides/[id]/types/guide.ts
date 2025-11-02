export interface SubSection {
  id: string;
  title: string;
  content?: string;
  images?: string[];
}

export interface Section {
  id: string;
  title: string;
  content?: string;
  images?: string[];
  subSections?: SubSection[];
}

export interface Guide {
  id: string;
  title: string;
  game: string;
  image: string;
  mainContentImages?: string[];
  views?: string;
  time?: string;
  category?: string;
  description?: string;
  content?: string;
  sections?: Section[];
}