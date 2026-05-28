export interface ResumeItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  dateRange?: string;
  link?: string;
}

export interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'projects' | 'skills';
  title: string;
  items: ResumeItem[];
}

export interface Resume {
  userId: string;
  slug: string;
  theme: 'light' | 'dark' | 'vibe';
  name: string;
  bio: string;
  links: { platform: string; url: string }[];
  sections: ResumeSection[];
  views: number;
  createdAt: string;
  updatedAt: string;
}
