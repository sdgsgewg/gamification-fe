import dayjs from "dayjs";
import z from "zod";

export const shareTaskSchema = z
  .object({
    // taskId: z.string().nonempty("Tugas wajib dipilih"),
    taskId: z.string().optional().nullable(),
    // classIds: z.array(z.string()).nonempty("Kelas wajib dipilih"),
    classIds: z.array(z.string()).optional().nullable(),
    startDate: z.date().optional(),
    startTime: z.date().optional(),
    endDate: z.date().optional(),
    endTime: z.date().optional(),
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

export type ShareTaskFormInputs = z.infer<typeof shareTaskSchema>;

export const shareTaskDefaultValues: ShareTaskFormInputs = {
  taskId: "",
  classIds: [],
  startTime: undefined,
  endTime: undefined,
};
