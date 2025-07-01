export interface LearningTopic {
  _id: string;
  title: string;
  description: string;
  quizzesCount?: number;
  storiesCount?: number;
}

export interface Quiz {
  _id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
  info?: string;
}

export type UserUpdatePayload = {
  fullname?: string;
  phone?: string;
  dob?: string;
  password?: string;
};