import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata("Tugas", "Halaman tentang tugas siswa");

const TaskPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Tugas</h1>
        <p>Welcome to our website! This is the task page.</p>
      </section>
    </div>
  );
};

export default TaskPage;
