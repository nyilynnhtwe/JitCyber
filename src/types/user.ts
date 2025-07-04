export interface User {
    _id: string;
    idType: string;
    id: string;
    fullname: string;
    phone: string;
    createdAt: string;
    dob: string;
}


export interface Topic {
    _id: string;
    title: string;
    titleThai: string;
    description: string;
    descriptionThai: string;
    quizzesCount: number;
}


export interface ScoreEntry {
    topicId: string;
    score: number;
}

export interface UserDocument {
    id: string;
    scores: ScoreEntry[];
}
