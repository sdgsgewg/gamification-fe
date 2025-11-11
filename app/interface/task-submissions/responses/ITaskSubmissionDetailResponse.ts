export interface TaskDetail {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  subject: string;
  material?: string;
  grade: string;
  questionCount: number;
  difficulty: string;
  type: string;
}

export interface SubmissionProgress {
  reviewedQuestionCount: number;
  totalQuestionCount: number;
  startGradedAt: string;
  lastGradedAt: string;
  finishGradedAt?: string;
  status: string;
}

export interface SubmissionSummary {
  score: number;
  feedback: string;
  pointGained: number;
  totalPoints: number;
  xpGained: number;
}

export interface AnswerLog {
  answerLogId: string | null;
  text: string | null;
  image: string | null;
  optionId: string | null;
  isCorrect: boolean | null;
}

export interface QuestionOption {
  optionId: string;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
}

export interface Question {
  questionId: string;
  text: string;
  point: number;
  type: string;
  timeLimit?: number;
  image?: string;
  options?: QuestionOption[];
  userAnswer?: AnswerLog;
}

export interface TaskSubmissionDetailResponse {
  id: string;
  taskDetail: TaskDetail;
  progress: SubmissionProgress;
  summary: SubmissionSummary;
  questions: Question[];
}
