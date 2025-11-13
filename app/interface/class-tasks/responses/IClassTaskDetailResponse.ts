import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface TaskType {
  id: string;
  name: string;
  isRepeatable: boolean;
}

export interface CurrentAttempt {
  answeredCount: number;
  startedAt: string;
  lastAccessedAt: string;
  status: TaskAttemptStatus;
}

export interface RecentAttempt {
  startedAt: string;
  lastAccessedAt: string;
  submittedAt: string;
  completedAt: string;
  status: TaskAttemptStatus;
}

export interface TaskAttemptStats {
  pointGained: number;
  totalPoints: number;
  xpGained: number;
  score: number;
}

export interface TaskDuration {
  startTime?: Date;
  endTime?: Date;
  duration?: string;
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

interface TaskSubmission {
  score: number;
  feedback: string;
  status: string;
  gradedBy: string;
  gradedAt: string;
}

export interface ClassTaskDetailResponseDto {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  subject: { id: string; name: string };
  material?: { id: string; name: string };
  grade: string;
  questionCount: number;
  difficulty: string;
  createdBy: string;
  type: TaskType;
  currAttempt?: CurrentAttempt;
  recentAttempt?: RecentAttempt;
  stats: TaskAttemptStats;
  duration?: TaskDuration;
  questions: Question[];
  submission?: TaskSubmission;
}
