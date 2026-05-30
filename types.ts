export interface DayOfWeek {
  id: string;
  spanish: string;
  armenian: string;
  order: number; // 0 to 6 (lunes=0)
}

export interface NounItem {
  spanish: string; // e.g. "perro"
  armenian: string; // e.g. "շուն"
  gender: 'M' | 'F';
  number: 'S' | 'P'; // Singular / Plural
  definition: string; // e.g. "perro (շուն)"
}

export interface QuizQuestion {
  id: number;
  questionArm: string;
  questionEsp: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SentenceQuestion {
  id: number;
  sentenceWithBlank: string; // e.g. "Hoy es ___."
  translation: string; // e.g. "Այսօր երկուշաբթի է:"
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ArticleRule {
  type: 'definite' | 'indefinite';
  gender: 'masculine' | 'feminine';
  number: 'singular' | 'plural';
  article: string;
  exampleArm: string;
  exampleEsp: string;
}
