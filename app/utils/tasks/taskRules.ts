import { TaskStatus } from "@/app/enums/TaskStatus";
import { TaskTypeScope } from "@/app/enums/TaskTypeScope";

// ----- SCOPE RULES -----
export const scopeRules = {
  [TaskTypeScope.ACTIVITY]: {
    edit: true,
    share: false,
    publish: true,
    unpublish: true,
    finalize: true,
    delete: true,
  },
  [TaskTypeScope.CLASS]: {
    edit: true,
    share: true,
    publish: false,
    unpublish: false,
    finalize: true,
    delete: true,
  },
  [TaskTypeScope.GLOBAL]: {
    edit: true,
    share: true,
    publish: true,
    unpublish: true,
    finalize: true,
    delete: true,
  },
} as const;

// ----- STATUS RULES -----
export const statusRules = {
  [TaskStatus.DRAFT]: {
    edit: true,
    share: true,
    publish: true,
    unpublish: false,
    finalize: false,
    delete: true,
  },
  [TaskStatus.PUBLISHED]: {
    edit: true,
    share: true,
    publish: false,
    unpublish: true,
    finalize: true,
    delete: false,
  },
  [TaskStatus.FINALIZED]: {
    edit: false,
    share: false,
    publish: false,
    unpublish: false,
    finalize: false,
    delete: false,
  },
} as const;

// ----- FINAL MERGE FUNCTION -----
export const getTaskRules = (status: TaskStatus, scope: TaskTypeScope) => {
  const statusRule = statusRules[status];
  const scopeRule = scopeRules[scope];

  return {
    edit: statusRule.edit && scopeRule.edit,
    share: statusRule.share && scopeRule.share,
    publish: statusRule.publish && scopeRule.publish,
    unpublish: statusRule.unpublish && scopeRule.unpublish,
    finalize: statusRule.finalize && scopeRule.finalize,
    delete: statusRule.delete && scopeRule.delete,
  };
};
