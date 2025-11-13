export type TaskDetailBottomContentView =
  | "similar-activities" // khsusus untuk page "activity detail"
  | "stats" // menampilkan statistik setelah mengerjakan tugas
  | "duration" // menampilkan durasi untuk jangka waktu mengerjakan suatu task
  | "history" // khusus untuk task detail page di modul dashboard
  | "progress" // menampilkan progress pengerjaan task attempt
  | "submissions" // khsusus untuk page "teacher task detail"
  | "submission-summary" // khsusus untuk page "teacher submission detail"
  | "questions" // menampilkan daftar soal (jika task attempt sudah completed, disertakan jawaban juga)
