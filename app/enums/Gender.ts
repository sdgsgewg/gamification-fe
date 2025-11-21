export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export const GenderLabels: Record<Gender, string> = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
  [Gender.Other]: "Other",
};
