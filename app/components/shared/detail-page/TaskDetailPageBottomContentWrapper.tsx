import React from "react";
import Button from "../Button";
import { TaskDetailBottomContentView } from "@/app/types/TaskDetailBottomContentView";

interface TaskDetailPageBottomContentWrapperProps {
  tabs: { key: TaskDetailBottomContentView; label: string }[];
  view: TaskDetailBottomContentView;
  onChangeTab: (key: TaskDetailBottomContentView) => void;
  children: React.ReactNode;
}

const TaskDetailPageBottomContentWrapper = ({
  tabs,
  view,
  onChangeTab,
  children,
}: TaskDetailPageBottomContentWrapperProps) => {
  return (
    <>
      {/* Navigation tab antar view */}
      <div className="w-full flex items-center mb-6 border-b border-b-primary">
        <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="middle"
              onClick={() => onChangeTab(tab.key)}
              className={`relative flex items-center gap-2 !px-10 !py-1 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150
                ${
                  view === tab.key
                    ? "!bg-primary !text-white"
                    : "!bg-background hover:!bg-background-hover !text-dark"
                }`}
            >
              <span>{tab.label}</span>
              {view === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-br-primary rounded-t-sm" />
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full md:max-w-[70%] lg:max-w-[80%] ">{children}</div>
    </>
  );
};

export default TaskDetailPageBottomContentWrapper;
