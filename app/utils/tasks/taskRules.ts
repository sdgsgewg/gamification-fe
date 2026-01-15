import { TaskStatus } from "@/app/enums/TaskStatus";
import { TaskTypeScope } from "@/app/enums/TaskTypeScope";

// ----- SCOPE RULES -----
export const scopeRules = {
  [TaskTypeScope.ACTIVITY]: {
    edit: true,
    delete: true,
    finalize: true,
    share: false,
    publish: true,
    unpublish: true,
    archive: true,
  },
  [TaskTypeScope.CLASS]: {
    edit: true,
    delete: true,
    finalize: true,
    share: true,
    publish: false,
    unpublish: false,
    archive: true,
  },
  [TaskTypeScope.GLOBAL]: {
    edit: true,
    delete: true,
    finalize: true,
    share: true,
    publish: true,
    unpublish: true,
    archive: true,
  },
} as const;

// ----- STATUS RULES -----
export const statusRules = {
  [TaskStatus.DRAFT]: {
    edit: true,
    delete: true,
    finalize: true,
    share: false,
    publish: false,
    unpublish: false,
    archive: false,
  },
  [TaskStatus.FINALIZED]: {
    edit: false,
    delete: false,
    finalize: false,
    share: true,
    publish: true,
    unpublish: false,
    archive: false,
  },
  [TaskStatus.PUBLISHED]: {
    edit: false,
    delete: false,
    finalize: false,
    share: true,
    publish: false,
    unpublish: true,
    archive: true,
  },
  [TaskStatus.ARCHIVED]: {
    edit: false,
    delete: false,
    finalize: false,
    share: false,
    publish: false,
    unpublish: false,
    archive: false,
  },
} as const;

// ----- FINAL MERGE FUNCTION -----
export const getTaskRules = (status: TaskStatus, scope: TaskTypeScope) => {
  const statusRule = statusRules[status];
  const scopeRule = scopeRules[scope];

  return {
    edit: statusRule.edit && scopeRule.edit,
    delete: statusRule.delete && scopeRule.delete,
    finalize: statusRule.finalize && scopeRule.finalize,
    share: statusRule.share && scopeRule.share,
    publish: statusRule.publish && scopeRule.publish,
    unpublish: statusRule.unpublish && scopeRule.unpublish,
    archive: statusRule.archive && scopeRule.archive,
  };
};
