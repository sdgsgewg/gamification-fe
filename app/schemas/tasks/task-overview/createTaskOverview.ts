import dayjs from "dayjs";
import z from "zod";

export const createTaskOverviewSchema = z
  .object({
    title: z.string().nonempty("Judul wajib diisi"),
    description: z.string().optional(),
    creatorId: z.string().nonempty("Pengguna wajib dipilih"),
    subjectId: z.string().nonempty("Mata pelajaran wajib dipilih"),
    materialId: z.string().optional(),
    taskTypeId: z.string().nonempty("Tipe tugas wajib dipilih"),
    gradeIds: z.array(z.string()).nonempty("Tingkat kelas wajib dipilih"),
    difficulty: z.string().nonempty("Tingkat kesulitan wajib dipilih"),
    createdBy: z.string().nonempty("Pengguna wajib diisi"),
    startDate: z.date().optional(),
    startTime: z.date().optional(),
    endDate: z.date().optional(),
    endTime: z.date().optional(),
    imageFile: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.startTime && data.endDate && data.endTime) {
        const start = dayjs(data.startDate)
          .hour(dayjs(data.startTime).hour())
          .minute(dayjs(data.startTime).minute());
        const end = dayjs(data.endDate)
          .hour(dayjs(data.endTime).hour())
          .minute(dayjs(data.endTime).minute());
        return end.isAfter(start);
      }
      return true;
    },
    {
      message: "Waktu selesai harus lebih besar dari waktu mulai",
      path: ["endTime"],
    }
  );

export type CreateTaskOverviewFormInputs = z.infer<
  typeof createTaskOverviewSchema
>;

export const createTaskOverviewDefaultValues: CreateTaskOverviewFormInputs = {
  title: "",
  description: "",
  creatorId: "",
  createdBy: "",
  subjectId: "",
  materialId: "",
  taskTypeId: "",
  gradeIds: [],
  difficulty: "",
  startDate: undefined,
  startTime: undefined,
  endDate: undefined,
  endTime: undefined,
  imageFile: undefined,
};
