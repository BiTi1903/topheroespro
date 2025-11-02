// app/admin/types.ts
import { Timestamp } from "firebase/firestore";

export interface SubSection {
  id: string;
  title: string;
  content: string;
  images?: string[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  images?: string[];
  subSections: SubSection[];
}

export interface Category {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  mainContentImages?: string[];
  sections: Section[];
  category?: string;
  game?: string;
  createdAt: Timestamp;
  pinned?: boolean;
}