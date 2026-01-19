import { ActivityWithQuestionsResponse } from "@/app/interface/activities/responses/IActivityWithQuestionsResponse";
import { ClassTaskWithQuestionsResponse } from "@/app/interface/class-tasks/responses/IClassTaskWithQuestionResponse";
import { UpsertTaskAttemptFormInputs } from "@/app/schemas/task-attempts/upsertTaskAttempt";

interface Params {
  // data: any;
  data: ActivityWithQuestionsResponse | ClassTaskWithQuestionsResponse;
  userId: string;
  answers: Record<string, any>;
  startedAt: Date;
  lastAccessedAt: Date;
  createAttempt: (payload: any) => Promise<any>;
  updateAttempt: (id: string, payload: any) => Promise<any>;
}

export const useAttemptActions = ({
  data,
  userId,
  answers,
  startedAt,
  lastAccessedAt,
  createAttempt,
  updateAttempt,
}: Params) => {
  const buildAnswerLogs = () =>
    data.questions.map((q: any) => ({
      questionId: q.questionId,
      answerLogId: q.userAnswer?.answerLogId,
      optionId: answers[q.questionId]?.optionId ?? null,
      answerText: answers[q.questionId]?.answerText ?? null,
    }));

  const saveProgress = async () => {
    const answerLogs = buildAnswerLogs();
    const payload: UpsertTaskAttemptFormInputs = {
      answeredQuestionCount: answerLogs.filter(
        (a: any) => a.optionId || a.answerText,
      ).length,
      startedAt,
      lastAccessedAt,
      answerLogs,
      taskId:
        (data as ClassTaskWithQuestionsResponse).taskId ||
        (data as ActivityWithQuestionsResponse).id,
      studentId: userId,
      classId: (data as ClassTaskWithQuestionsResponse).classId || null,
    };

    return data.lastAttemptId
      ? updateAttempt(data.lastAttemptId, payload)
      : createAttempt(payload);
  };

  const submitAttempt = async () => {
    const answerLogs = buildAnswerLogs();
    const payload: UpsertTaskAttemptFormInputs = {
      answeredQuestionCount: answerLogs.length,
      startedAt,
      lastAccessedAt,
      answerLogs,
      taskId: data.id,
      studentId: userId,
      classId: (data as ClassTaskWithQuestionsResponse).classId || null,
    };

    return data.lastAttemptId
      ? updateAttempt(data.lastAttemptId, payload)
      : createAttempt(payload);
  };

  return { saveProgress, submitAttempt };
};
