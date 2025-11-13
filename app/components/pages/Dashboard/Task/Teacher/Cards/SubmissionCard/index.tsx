import { AssignedClassInfo } from "@/app/interface/tasks/responses/ITaskDetailResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCheckCircle,
  faFileAlt,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/components/shared/Button";

interface SubmissionCardProps {
  cls: AssignedClassInfo;
}

const SubmissionCard = ({ cls }: SubmissionCardProps) => {
  const submittedPercentage = Math.round(
    (cls.submissionCount / cls.totalStudents) * 100
  );

  // Warna status badge
  const isCompleted = submittedPercentage === 100;
  const statusBadgeClass = isCompleted
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-4 bg-background rounded-xl shadow-sm border border-br-primary hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-dark">{cls.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass}`}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* Progress bar submission rate */}
      <div className="w-full bg-light-muted h-2 rounded-full mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${submittedPercentage}%` }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 text-sm text-tx-secondary mb-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUsers} className="text-tx-tertiary" />
          <span>{cls.totalStudents} students</span>
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-tx-tertiary" />
          <span>
            {cls.submissionCount} submitted,{" "}
            {cls.totalStudents - cls.submissionCount} pending
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faFileAlt} className="text-tx-tertiary" />
          <span>{cls.gradedCount} graded</span>
        </div>

        {cls.deadline && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-tx-tertiary"
            />
            <span>Deadline: {cls.deadline}</span>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <Button variant="primary" size="middle">
          View Submission
        </Button>
      </div>
    </div>
  );
};

export default SubmissionCard;
