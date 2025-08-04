import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Mata Pelajaran",
  "Halaman tentang manajemen mata pelajaran"
);

const SubjectPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Mata Pelajaran</h1>
        <p>Welcome to our website! This is the subject page.</p>
      </section>
    </div>
  );
};

export default SubjectPage;
