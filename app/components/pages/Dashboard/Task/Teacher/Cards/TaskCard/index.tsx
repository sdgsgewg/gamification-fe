"use client";

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/components/shared/Button";
import { IMAGES } from "@/app/constants/images";
import { TaskOverviewResponse } from "@/app/interface/tasks/responses/ITaskOverviewResponse";

interface TaskCardProps {
  task: TaskOverviewResponse;
  onEdit: (slug: string) => void;
  onView: (slug: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onView }) => {
  return (
    <div className="rounded-2xl border border-br-secondary bg-card shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-br-tertiary">
        <div>
          <h2 className="text-lg font-semibold text-tx-primary">
            {task.title}
          </h2>
          {/* <small className="text-tx-muted italic">
            * You can only delete task that has not been shared
          </small> */}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-col gap-4 mb-4">
          <p className="text-sm text-tx-tertiary">
            {task.assignedClassCount > 0
              ? `Task shared to ${task.assignedClassCount} ${
                  task.assignedClassCount > 1 ? "classes" : "class"
                }`
              : "Task has not been shared"}
          </p>

          <div className="flex items-center gap-2 text-sm text-tx-muted">
            <div className="w-4">
              <Image
                src={IMAGES.TASK}
                alt={task.taskType}
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
            </div>
            <p>{task.taskType}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-tx-muted">
            <div className="w-4">
              <Image
                src={IMAGES.SUBJECT}
                alt={task.subject}
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
            </div>
            <p>{task.subject}</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <Button
            variant="warning"
            className="w-1/2 flex gap-2"
            onClick={() => onEdit(task.slug)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>Edit</span>
          </Button>

          <Button
            variant="view"
            className="w-1/2 flex gap-2"
            onClick={() => onView(task.slug)}
          >
            <FontAwesomeIcon icon={faEye} />
            <span>View Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
