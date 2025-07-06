export interface Player {
  id: string;
  name: string;
  score: number;
  phone?: string; // Optional, can be used for contact
}

export interface RankedPlayer extends Player {
  rank: number;
}



export interface Lesson {
  // _id is optional
  _id?: string;
  content: { en: string; th: string };
};

export interface Story {
  _id?: string;
  title: { en: string; th: string };
  subtitle: { en: string; th: string };
  content: { en: string; th: string };
  lessons: Lesson[];
  imageUrl?: string;
};

export interface StoryViewerProps {
  stories: Story[];
}