export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  ORDERING = 'ORDERING',
  MATCHING = 'MATCHING',
  IMAGE_CHOICE = 'IMAGE_CHOICE'
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[]; // For MC, Image Choice
  correctAnswer?: string | boolean; // For MC, T/F
  correctOrder?: string[]; // For Ordering
  matchingPairs?: MatchingPair[]; // For Matching
}

export interface GameState {
  view: 'WELCOME' | 'GAME' | 'RESULT';
  score: number;
  currentQuestionIndex: number;
  answersHistory: boolean[]; // track correct/incorrect for progress bar
}