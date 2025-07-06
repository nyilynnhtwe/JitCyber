export interface LearningTopic {
  _id: string;
  title: string;
  description: string;
  titleInThai?: string;
  descInThai?: string;
  quizzesCount?: number;
  storiesCount?: number;
}

export interface Quiz {
  _id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
  explanation?: string;
}

export type UserUpdatePayload = {
  id?: string;
  idType?: "thai" | "foreign";
  fullname?: string;
  phone?: string;
  dob?: string;
  password?: string;
};