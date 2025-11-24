type EntityType =
  | "subject"
  | "material"
  | "task type"
  | "task"
  | "class"
  | "user"
  | string;

const ENTITY_LABELS: Record<EntityType, string> = {
  subject: "Subject",
  material: "Material",
  taskType: "Task Type",
  task: "Task",
  class: "Class",
  user: "User",
};

// Special overrides for weird field names or special phrasing
const FIELD_OVERRIDES: Record<string, { label: string; placeholder: string }> =
  {
    description: {
      label: "Description",
      placeholder: "Enter description",
    },
    subjectId: {
      label: "Subject",
      placeholder: "Select subject",
    },
    gradeIds: {
      label: "Grade Level",
      placeholder: "Select grade level(s)",
    },
    imageFile: {
      label: "Upload Image",
      placeholder: "",
    },
  };

export function formText(entity: EntityType, field: string) {
  // Case 1: field contains override
  if (FIELD_OVERRIDES[field]) {
    return FIELD_OVERRIDES[field];
  }

  // Case 2: default generator
  const entityLabel = ENTITY_LABELS[entity] ?? capitalize(entity);

  const label = `${entityLabel} ${capitalize(field)}`;
  const placeholder = `Enter ${entityLabel.toLowerCase()} ${field.toLowerCase()}`;

  return { label, placeholder };
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
