export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface RankedPlayer extends Player {
  rank: number;
}
