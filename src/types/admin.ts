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
  question: { en?: string; th?: string };
  answers: Array<{ en?: string; th?: string }>;
  correctAnswer: { en?: string; th?: string };
  correctAnswerIndex: number;
  explanation: { en?: string; th?: string };
}

export type UserUpdatePayload = {
  id?: string;
  idType?: "thai" | "foreign";
  fullname?: string;
  phone?: string;
  dob?: string;
  password?: string;
};