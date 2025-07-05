export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface RankedPlayer extends Player {
  rank: number;
}



export interface Lesson {
  // _id is optional
  _id?: string;
  content: string;
};

export interface Story {
  _id?: string;
  title: string;
  subtitle: string;
  content: string;
  lessons: Lesson[];
  imageUrl?: string;
};

export interface StoryViewerProps {
  stories: Story[];
}